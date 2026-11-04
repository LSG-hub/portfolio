import React, { useEffect, useRef, useState } from 'react';
import PhotoGuide from './PhotoGuide';

const COUNTDOWN = 3;

/** Why the camera didn't start, in words a visitor can act on. */
const cameraError = (err) => {
  if (!window.isSecureContext) return 'The camera only works over a secure (https) connection.';
  if (!navigator.mediaDevices?.getUserMedia) return 'This browser can’t use the camera. Upload a photo instead.';
  switch (err?.name) {
    case 'NotAllowedError':
      return 'Camera access was blocked. Allow it in your browser’s address bar, or upload a photo instead.';
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
 * Live preview, mirrored like a mirror so moving into the guide feels natural;
 * the captured photo is not mirrored, matching how others see you.
 *
 * The stage has the photo's own aspect ratio and the video covers it, so the
 * visible crop is exactly what gets captured: onCapture receives the full frame
 * plus `cover: true`, and the parent frames it the same way the preview did.
 */
const CameraCapture = ({ preset, onCapture, onError }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(null);

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
      } catch (err) {
        if (!cancelled) onError(cameraError(err));
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onError]);

  useEffect(() => {
    if (count === null) return undefined;
    if (count === 0) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setCount(null);
      createImageBitmap(canvas).then(onCapture);
      return undefined;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onCapture]);

  return (
    <div className="photo-camera">
      <div className="photo-stage">
        <video ref={videoRef} className="photo-stage-canvas photo-camera-video" playsInline muted />
        <PhotoGuide preset={preset} />
        {count !== null && count > 0 && (
          <span className="photo-camera-count" aria-live="assertive">{count}</span>
        )}
        {!ready && <span className="photo-stage-status">Starting the camera…</span>}
      </div>
      <button
        type="button"
        className="glass-link primary photo-camera-shutter"
        onClick={() => setCount(COUNTDOWN)}
        disabled={!ready || count !== null}
      >
        {count !== null ? 'Hold still…' : `Take photo in ${COUNTDOWN} seconds`}
      </button>
    </div>
  );
};

export default CameraCapture;
