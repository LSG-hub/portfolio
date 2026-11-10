import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { camera, getPhotoPurpose, printSheet } from '../data/studio';
import {
  canEncode,
  coverFraming,
  decodeFile,
  download,
  drawFramed,
  encodeUnder,
  FORMATS,
  formatSize,
  renderPhoto,
  renderSheet,
  sheetLayout,
  sizeToPx
} from '../utils/photoExport';
import { notFoundMeta, photoPurposeMeta } from '../utils/seo';
import { profile } from '../data/profile';
import usePageMeta from '../hooks/usePageMeta';
import CameraCapture from '../components/studio/CameraCapture';
import PhotoFramer from '../components/studio/PhotoFramer';
import PhotoGuide from '../components/studio/PhotoGuide';
import NotFoundPage from './NotFoundPage';
import '../styles/components/studio.css';

const STEPS = {
  capture: { n: 1, title: 'Take or upload a photo' },
  adjust: { n: 2, title: 'Check and adjust' },
  finish: { n: 3, title: 'Download' }
};

const LIMITS = { mm: [5, 300], in: [0.2, 12], px: [50, 6000] };
const PER_INCH = { mm: 25.4, in: 1, px: 300 };

/** Convert a length between units, treating pixels as 300 DPI so a size keeps its meaning. */
const convert = (value, from, to) => {
  const out = (value / PER_INCH[from]) * PER_INCH[to];
  return to === 'px' ? Math.round(out) : Number(out.toFixed(to === 'in' ? 2 : 1));
};

const valid = (value, unit) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= LIMITS[unit][0] && n <= LIMITS[unit][1];
};

/** Width, height, unit and an optional KB limit, for the custom size. */
const SizeEditor = ({ draft, onChange }) => {
  const setUnit = (unit) => {
    if (unit === draft.unit) return;
    onChange({
      ...draft,
      unit,
      width: valid(draft.width, draft.unit) ? String(convert(Number(draft.width), draft.unit, unit)) : draft.width,
      height: valid(draft.height, draft.unit) ? String(convert(Number(draft.height), draft.unit, unit)) : draft.height
    });
  };
  const [min, max] = LIMITS[draft.unit];
  return (
    <div className="studio-size-editor">
      <label className="studio-field">
        <span>Width</span>
        <input type="number" inputMode="decimal" min={min} max={max} step="any" value={draft.width}
          aria-invalid={!valid(draft.width, draft.unit)}
          onChange={(e) => onChange({ ...draft, width: e.target.value })} />
      </label>
      <span className="studio-size-times" aria-hidden="true">×</span>
      <label className="studio-field">
        <span>Height</span>
        <input type="number" inputMode="decimal" min={min} max={max} step="any" value={draft.height}
          aria-invalid={!valid(draft.height, draft.unit)}
          onChange={(e) => onChange({ ...draft, height: e.target.value })} />
      </label>
      <div className="studio-segmented" role="radiogroup" aria-label="Unit">
        {['mm', 'in', 'px'].map((u) => (
          <button key={u} type="button" role="radio" aria-checked={draft.unit === u}
            className={draft.unit === u ? 'is-active' : ''} onClick={() => setUnit(u)}>{u}</button>
        ))}
      </div>
      <label className="studio-field">
        <span>Max file size</span>
        <span className="studio-field-suffix">
          <input type="number" inputMode="numeric" min="5" step="1" placeholder="No limit" value={draft.maxKB}
            onChange={(e) => onChange({ ...draft, maxKB: e.target.value })} />
          <em>KB</em>
        </span>
      </label>
    </div>
  );
};

/** The finished photo, drawn from the same framing as the export. */
const PreviewCanvas = ({ image, framing, round }) => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawFramed(canvas.getContext('2d'), image, framing, canvas.width, canvas.height);
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [image, framing]);
  return <canvas ref={ref} className={`studio-preview ${round ? 'is-round' : ''}`} />;
};

const SheetPreview = ({ photoCanvas }) => {
  const ref = useRef(null);
  useEffect(() => {
    const { canvas: sheet } = renderSheet(photoCanvas, printSheet);
    const out = ref.current;
    out.width = sheet.width / 2;
    out.height = sheet.height / 2;
    out.getContext('2d').drawImage(sheet, 0, 0, out.width, out.height);
  }, [photoCanvas]);
  return <canvas ref={ref} className="studio-sheet-preview" />;
};

const PhotoStudioPage = () => {
  const { purpose: slug } = useParams();
  const purpose = getPhotoPurpose(slug);
  usePageMeta(purpose ? photoPurposeMeta(purpose) : notFoundMeta(profile));
  if (!purpose) return <NotFoundPage />;
  // Keyed by slug so moving between purposes starts each one fresh.
  return <PhotoFlow key={purpose.slug} purpose={purpose} />;
};

const PhotoFlow = ({ purpose }) => {
  const [draft, setDraft] = useState({
    width: String(purpose.size.width),
    height: String(purpose.size.height),
    unit: purpose.size.unit,
    maxKB: ''
  });
  const [size, setSize] = useState(purpose.size);
  useEffect(() => {
    if (purpose.editable && valid(draft.width, draft.unit) && valid(draft.height, draft.unit)) {
      setSize({ width: Number(draft.width), height: Number(draft.height), unit: draft.unit });
    }
  }, [draft, purpose.editable]);
  const maxKB = purpose.editable && Number(draft.maxKB) > 0 ? Number(draft.maxKB) : null;

  const px = useMemo(() => sizeToPx(size), [size]);
  const aspect = px.height / px.width;
  const printable = purpose.printable && size.unit !== 'px';
  const sheetCount = useMemo(() => sheetLayout(px.width, px.height, printSheet).count, [px]);

  const [step, setStep] = useState('capture');
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [delay, setDelay] = useState(0);
  const [count, setCount] = useState(null);
  const [image, setImage] = useState(null);
  const [framing, setFraming] = useState(null);
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(null);
  const [sizeOpen, setSizeOpen] = useState(true);
  const cameraRef = useRef(null);
  const fileRef = useRef(null);

  const formats = useMemo(
    () => FORMATS.filter((f) => canEncode(f.mime) && !(maxKB && f.mime === 'image/png')),
    [maxKB]
  );
  const [formatId, setFormatId] = useState('jpg');
  const format = formats.find((f) => f.id === formatId) ?? formats[0];

  const base = image ? coverFraming(image, aspect).scale : 1;

  // A new size means a new frame shape: start the framing over rather than keep a crop made for another shape.
  useEffect(() => {
    if (image) setFraming(coverFraming(image, aspect));
  }, [aspect, image]);

  useEffect(() => {
    if (cameraOn) setSizeOpen(false);
  }, [cameraOn]);

  const acceptImage = useCallback(
    (bitmap, from) => {
      setSizeOpen(false);
      setImage(bitmap);
      setFraming(coverFraming(bitmap, aspect));
      setSource(from);
      setError('');
      setNotice('');
      setCameraOn(false);
      setCameraReady(false);
      setStep('adjust');
    },
    [aspect]
  );

  const onCameraReady = useCallback(() => setCameraReady(true), []);
  const onCameraError = useCallback((message) => {
    setError(message);
    setCameraOn(false);
    setCameraReady(false);
  }, []);

  const shoot = useCallback(async () => {
    const bitmap = await cameraRef.current?.capture();
    if (bitmap) acceptImage(bitmap, 'camera');
  }, [acceptImage]);

  useEffect(() => {
    if (count === null) return undefined;
    if (count === 0) {
      setCount(null);
      shoot();
      return undefined;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, shoot]);

  const onShutter = () => (delay ? setCount(delay) : shoot());

  const turnOffCamera = () => {
    setCount(null);
    setCameraOn(false);
    setCameraReady(false);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      acceptImage(await decodeFile(file), 'upload');
    } catch (err) {
      setError(err.message);
    }
  };

  const retake = () => {
    setStep('capture');
    setNotice('');
    setCameraOn(source === 'camera');
  };

  const zoom = framing ? framing.scale / base : 1;
  const setZoom = (value) => {
    const k = (value * base) / framing.scale;
    const py = aspect / 2;
    setFraming({ scale: value * base, cx: 0.5 + (framing.cx - 0.5) * k, cy: py + (framing.cy - py) * k });
  };

  const photoCanvas = useMemo(
    () => (step === 'finish' && image ? renderPhoto(image, framing, px) : null),
    [step, image, framing, px]
  );

  const name = `${purpose.slug}-${String(size.width).replace('.', '_')}x${String(size.height).replace('.', '_')}${size.unit}`;
  const save = async (kind) => {
    setBusy(kind);
    setNotice('');
    try {
      const canvas = kind === 'photo' ? photoCanvas : renderSheet(photoCanvas, printSheet).canvas;
      const { blob, fits } = await encodeUnder(canvas, format, kind === 'photo' ? maxKB : null);
      download(blob, kind === 'photo' ? `${name}.${format.ext}` : `${name}-print-sheet-4x6.${format.ext}`);
      const kb = Math.ceil(blob.size / 1024);
      setNotice(
        fits
          ? `Saved, ${kb} KB.`
          : `Saved, but it is ${kb} KB: this size can't get under ${maxKB} KB. Make the photo smaller in pixels, or allow a larger file.`
      );
    } catch {
      setNotice('The download couldn’t be created. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const filePicker = <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />;
  const sizeLabel = formatSize(size);

  return (
    <div className={`studio-flow is-${step} ${purpose.editable && step !== 'finish' ? (sizeOpen ? 'is-editable' : 'is-editable-closed') : ''}`}>
      <header className="studio-flow-head">
        <h1 className="studio-flow-title">{purpose.name}</h1>
        <p className="studio-flow-meta">
          <span>{sizeLabel}</span>
          {size.unit !== 'px' && <span>{px.width} × {px.height} px</span>}
          {maxKB && <span>under {maxKB} KB</span>}
        </p>
        <p className="studio-flow-step">
          <span className="studio-flow-step-n">{STEPS[step].n} / 3</span> {STEPS[step].title}
        </p>
      </header>

      {purpose.editable && step !== 'finish' && (sizeOpen ? (
        <SizeEditor draft={draft} onChange={setDraft} />
      ) : (
        <button type="button" className="studio-text-button" onClick={() => setSizeOpen(true)}>
          Change size
        </button>
      ))}

      {step === 'capture' && (
        <>
          <div className="studio-stage-area">
            {cameraOn ? (
              <CameraCapture
                ref={cameraRef}
                guide={purpose.guide}
                aspect={aspect}
                onReady={onCameraReady}
                onError={onCameraError}
                hint={camera.hint}
                overlay={count ? <span className="photo-camera-count" aria-live="assertive">{count}</span> : null}
              />
            ) : (
              <div className="photo-stage is-empty" style={{ '--aspect': aspect }}>
                <PhotoGuide guide={purpose.guide} aspect={aspect} />
              </div>
            )}
          </div>

          <div className="studio-controls">
            {error && <p className="studio-error" role="alert">{error}</p>}
            {cameraOn ? (
              <>
              <div className="studio-shutter-row">
                <div className="studio-segmented" role="radiogroup" aria-label="Timer">
                  {camera.delays.map((d) => (
                    <button key={d} type="button" role="radio" aria-checked={delay === d}
                      className={delay === d ? 'is-active' : ''} onClick={() => setDelay(d)} disabled={count !== null}>
                      {d ? `${d} s` : 'No timer'}
                    </button>
                  ))}
                </div>
                <button type="button" className="studio-shutter" onClick={onShutter}
                  disabled={!cameraReady || count !== null} aria-label={delay ? `Take photo in ${delay} seconds` : 'Take photo'}>
                  <span />
                </button>
                <div className="studio-camera-links">
                  <button type="button" className="studio-text-button" onClick={() => fileRef.current.click()}>
                    Upload instead
                  </button>
                  <button type="button" className="studio-text-button" onClick={turnOffCamera}>
                    Turn off camera
                  </button>
                </div>
              </div>
              </>
            ) : (
              <>
                <div className="studio-actions">
                  <button type="button" className="glass-link primary" onClick={() => { setError(''); setCameraOn(true); }}>
                    Start camera
                  </button>
                  <button type="button" className="glass-link" onClick={() => fileRef.current.click()}>
                    Upload a photo
                  </button>
                </div>
                <p className="studio-hint">{camera.permission}</p>
              </>
            )}
            {filePicker}
          </div>
        </>
      )}

      {step === 'adjust' && image && (
        <>
          <div className="studio-stage-area">
            <PhotoFramer image={image} framing={framing} onChange={setFraming} guide={purpose.guide}
              aspect={aspect} minScale={base * 0.5} maxScale={base * 6} />
          </div>
          <div className="studio-controls">
            <p className="studio-hint">Drag to move the photo. Pinch, scroll or use the slider to zoom.</p>
            <div className="studio-adjust-row">
              <button type="button" className="glass-link" onClick={retake}>
                {source === 'camera' ? 'Retake' : 'Choose another'}
              </button>
              <label className="studio-zoom">
                <span>Zoom</span>
                <input type="range" min="0.5" max="6" step="0.01" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
              </label>
              <button type="button" className="glass-link primary" onClick={() => setStep('finish')}>
                Use this photo <span className="arrow">&rarr;</span>
              </button>
            </div>
            {source === 'upload' && filePicker}
          </div>
        </>
      )}

      {step === 'finish' && photoCanvas && (
        <div className="studio-finish">
          <div className="studio-finish-previews">
            <figure className="studio-figure is-photo" style={{ '--aspect': aspect }}>
              <PreviewCanvas image={image} framing={framing} round={purpose.guide.kind === 'circle'} />
              <figcaption>
                {purpose.guide.kind === 'circle' ? 'As it will look. The file is square.' : `Photo · ${sizeLabel}`}
              </figcaption>
            </figure>
            {printable && (
              <figure className="studio-figure is-sheet">
                <SheetPreview photoCanvas={photoCanvas} />
                <figcaption>{printSheet.label} · {sheetCount} photos</figcaption>
              </figure>
            )}
          </div>

          <aside className="studio-finish-panel glass-flat">
            <span className="studio-label">Format</span>
            <div className="studio-segmented" role="radiogroup" aria-label="File format">
              {formats.map((f) => (
                <button key={f.id} type="button" role="radio" aria-checked={f.id === format.id}
                  className={f.id === format.id ? 'is-active' : ''} onClick={() => setFormatId(f.id)}>{f.label}</button>
              ))}
            </div>
            <button type="button" className="glass-link primary studio-download" onClick={() => save('photo')} disabled={!!busy}>
              {busy === 'photo' ? 'Preparing…' : 'Download photo'} <span className="arrow">&darr;</span>
            </button>
            {printable && (
              <button type="button" className="glass-link studio-download" onClick={() => save('sheet')} disabled={!!busy}>
                {busy === 'sheet' ? 'Preparing…' : `Download print sheet (${sheetCount})`} <span className="arrow">&darr;</span>
              </button>
            )}
            {notice && <p className="studio-notice" role="status">{notice}</p>}
            <div className="studio-finish-more">
              <button type="button" className="studio-text-button" onClick={() => setStep('adjust')}>Adjust the photo</button>
              <Link to="/studio/" className="studio-text-button">Make another photo</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default PhotoStudioPage;
