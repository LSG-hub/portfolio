import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PhotoGuide from './PhotoGuide';
import { assess, loadFaceLandmarker, MESSAGES, steady } from '../../utils/faceCheck';

/** Why the camera didn't start, in words a visitor can act on. */
const cameraError = (err) => {
  if (!window.isSecureContext) return 'The camera only works over a secure (https) connection. Upload a photo instead.';
  if (!navigator.mediaDevices?.getUserMedia) return 'This browser can’t use the camera. Upload a photo instead.';
  switch (err?.name) {
    case 'NotAllowedError':
      return 'Camera access was blocked. Allow it from the icon in your address bar, or upload a photo instead.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No camera was found. Upload a photo instead.';
    case 'NotReadableError':
      return 'The camera is in use by another app. Close it and try again.';
    default:
      return 'The camera couldn’t start. Upload a photo instead.';
  }
};

/**
 * Map landmarks from the video frame to the stage the visitor sees. The video
 * covers the stage (object-fit: cover) and is mirrored, so x is cropped, scaled
 * and flipped; y is cropped and scaled.
 */
function toStage(landmarks, video, stage) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const { width: W, height: H } = stage.getBoundingClientRect();
  const s = Math.max(W / vw, H / vh);
  const offX = (vw * s - W) / 2;
  const offY = (vh * s - H) / 2;
  return landmarks.map((face) =>
    face.map((pt) => ({ x: 1 - (pt.x * vw * s - offX) / W, y: (pt.y * vh * s - offY) / H }))
  );
}

/**
 * The live camera, inside a stage with the photo's own aspect ratio. The video
 * covers the stage, so the visible crop is exactly what gets captured and the
 * parent can frame the full capture with coverFraming. The preview is mirrored
 * like a mirror; the photo is not, matching how others see you.
 *
 * While it runs, the face is checked several times a second and the guide turns
 * green when it is right, with one instruction at a time otherwise. The checks
 * slow down on devices where they are expensive, so the preview never stutters.
 *
 * The parent owns the shutter: it calls ref.current.capture(), which resolves to
 * an ImageBitmap of the current frame.
 */
const CameraCapture = ({ ref, guide, aspect, hint, onReady, onError, overlay }) => {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [code, setCode] = useState('loading');
  const [checking, setChecking] = useState(true);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      return createImageBitmap(canvas);
    }
  }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
        onReady?.();
      } catch (err) {
        if (!cancelled) onError(cameraError(err));
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onError, onReady]);

  // The face check loop. Starts once the camera is live; the model loads in parallel.
  useEffect(() => {
    if (!ready) return undefined;
    let stopped = false;
    let timer = null;
    let interval = 120;
    const hold = steady();
    loadFaceLandmarker().then((landmarker) => {
      if (stopped) return;
      if (!landmarker) {
        setChecking(false);
        return;
      }
      const tick = () => {
        if (stopped) return;
        const video = videoRef.current;
        if (video && video.readyState >= 2) {
          const started = performance.now();
          const result = landmarker.detectForVideo(video, started);
          const faces = toStage(result.faceLandmarks || [], video, stageRef.current);
          setCode(hold(assess(faces, guide, aspect)));
          // Never spend more than about a fifth of the time checking.
          interval = Math.max(120, (performance.now() - started) * 5);
        }
        timer = setTimeout(tick, interval);
      };
      tick();
    });
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [ready, guide, aspect]);

  const message = checking ? MESSAGES.live[code] : hint;
  const good = checking && code === 'good';

  return (
    <div ref={stageRef} className="photo-stage is-camera" style={{ '--aspect': aspect }}>
      <video ref={videoRef} className="photo-stage-canvas photo-camera-video" playsInline muted />
      <PhotoGuide guide={guide} aspect={aspect} status={good ? 'good' : 'idle'} />
      {!ready && <span className="photo-stage-status">Starting the camera…</span>}
      {ready && (
        <span className={`photo-stage-tip ${good ? 'is-good' : ''}`} aria-live="polite">{message}</span>
      )}
      {overlay}
    </div>
  );
};

export default CameraCapture;
