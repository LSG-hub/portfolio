import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { passportPhotoTool as tool, photoPresets, printSheet } from '../data/tools';
import { richText } from '../utils/richText';
import { toolMeta } from '../utils/seo';
import usePageMeta from '../hooks/usePageMeta';
import {
  canEncode,
  coverFraming,
  decodeFile,
  download,
  DPI,
  encode,
  FORMATS,
  mmToPx,
  renderPhoto,
  renderSheet,
  sheetLayout
} from '../utils/photoExport';
import CameraCapture from '../components/tools/CameraCapture';
import PhotoFramer from '../components/tools/PhotoFramer';
import '../styles/components/tool-page.css';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const PassportPhotoPage = () => {
  usePageMeta(toolMeta(tool));
  const preset = photoPresets[0];
  const aspect = preset.heightMm / preset.widthMm;
  const px = { width: mmToPx(preset.widthMm), height: mmToPx(preset.heightMm) };
  const sheet = useMemo(() => sheetLayout(px.width, px.height, printSheet), [px.width, px.height]);

  const [mode, setMode] = useState('start'); // start | camera | frame
  const [image, setImage] = useState(null);
  const [framing, setFraming] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);
  const formats = useMemo(() => FORMATS.filter((f) => canEncode(f.mime)), []);
  const [formatId, setFormatId] = useState('jpg');
  const format = formats.find((f) => f.id === formatId) ?? formats[0];
  const fileRef = useRef(null);

  const base = image ? coverFraming(image, aspect).scale : 1;

  const acceptImage = useCallback(
    (bitmap) => {
      setImage(bitmap);
      setFraming(coverFraming(bitmap, aspect));
      setError('');
      setMode('frame');
    },
    [aspect]
  );

  const onCameraError = useCallback((message) => {
    setError(message);
    setMode('start');
  }, []);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      acceptImage(await decodeFile(file));
    } catch (err) {
      setError(err.message);
    }
  };

  const save = async (kind) => {
    setBusy(kind);
    try {
      const photo = renderPhoto(image, framing, preset);
      if (kind === 'photo') {
        download(await encode(photo, format), `passport-photo-${preset.widthMm}x${preset.heightMm}mm.${format.ext}`);
      } else {
        download(await encode(renderSheet(photo, printSheet).canvas, format), `passport-photos-4x6-print-sheet.${format.ext}`);
      }
    } catch (err) {
      setError('The download couldn’t be created. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const zoom = framing ? framing.scale / base : 1;
  const setZoom = (value) => {
    const k = (value * base) / framing.scale;
    const py = aspect / 2;
    setFraming({ scale: value * base, cx: 0.5 + (framing.cx - 0.5) * k, cy: py + (framing.cy - py) * k });
  };

  return (
    <article className="tool-page">
      <div className="container-narrow">
        <Link to="/" className="tool-page-back">
          <span className="arrow">&larr;</span> Back to portfolio
        </Link>

        <header className="tool-page-header">
          <span className="eyebrow">{tool.eyebrow}</span>
          <h1 className="tool-page-title">{tool.title}</h1>
          <p className="tool-page-lede">{richText(tool.lede)}</p>
        </header>

        <section className="tool-card glass-flat" aria-label={tool.name}>
          <div className="tool-card-stage">
            {mode === 'camera' && <CameraCapture preset={preset} onCapture={acceptImage} onError={onCameraError} />}
            {mode === 'frame' && image && (
              <PhotoFramer
                image={image}
                framing={framing}
                onChange={setFraming}
                preset={preset}
                minScale={base * 0.5}
                maxScale={base * 6}
              />
            )}
            {mode === 'start' && (
              <div className="photo-stage photo-stage-empty">
                <span className="photo-stage-size">{preset.size}</span>
                <span className="photo-stage-hint">Your photo appears here</span>
              </div>
            )}
          </div>

          <div className="tool-card-panel">
            <div className="tool-step">
              <span className="tool-step-label">01 / Photo</span>
              <div className="tool-step-actions">
                <button type="button" className="glass-link primary" onClick={() => { setError(''); setMode('camera'); }} disabled={mode === 'camera'}>
                  {mode === 'frame' ? 'Retake with camera' : 'Use camera'}
                </button>
                <button type="button" className="glass-link" onClick={() => fileRef.current.click()}>
                  {mode === 'frame' ? 'Upload another' : 'Upload a photo'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              </div>
              {error && <p className="tool-error" role="alert">{error}</p>}
            </div>

            <div className={`tool-step ${mode === 'frame' ? '' : 'is-waiting'}`}>
              <span className="tool-step-label">02 / Frame</span>
              <p className="tool-step-text">
                Top of your head on the upper line, chin inside the shaded band. Drag to move; scroll or pinch to zoom.
              </p>
              <label className="tool-range">
                <span>Zoom</span>
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  disabled={mode !== 'frame'}
                />
              </label>
            </div>

            <div className={`tool-step ${mode === 'frame' ? '' : 'is-waiting'}`}>
              <span className="tool-step-label">03 / Download</span>
              <div className="tool-formats" role="radiogroup" aria-label="File format">
                {formats.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={f.id === format.id}
                    className={`tool-format ${f.id === format.id ? 'is-active' : ''}`}
                    onClick={() => setFormatId(f.id)}
                    disabled={mode !== 'frame'}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="tool-downloads">
                <button type="button" className="tool-download" onClick={() => save('photo')} disabled={mode !== 'frame' || busy}>
                  <span className="tool-download-name">{busy === 'photo' ? 'Preparing…' : 'Photo'}</span>
                  <span className="tool-download-meta">{preset.size} · {px.width} × {px.height} px · {format.label}</span>
                </button>
                <button type="button" className="tool-download" onClick={() => save('sheet')} disabled={mode !== 'frame' || busy}>
                  <span className="tool-download-name">{busy === 'sheet' ? 'Preparing…' : 'Print sheet'}</span>
                  <span className="tool-download-meta">{printSheet.label} · {sheet.count} photos · {format.label}</span>
                </button>
              </div>
            </div>

            <p className="tool-privacy">Runs in your browser. Nothing is uploaded.</p>
          </div>
        </section>

        <section className="tool-section glass-flat">
          <h2 className="tool-section-title">How it works</h2>
          <div className="numbered-list">
            {tool.steps.map((step, i) => (
              <div key={i} className="numbered-item">
                <span className="numbered-item-num">{ROMAN[i]}</span>
                <p className="numbered-item-text">{richText(step)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tool-section glass-flat">
          <h2 className="tool-section-title">For a photo that gets accepted</h2>
          <ul className="tool-tips">
            {tool.tips.map((tip, i) => (
              <li key={i}>{richText(tip)}</li>
            ))}
          </ul>
        </section>

        <section className="tool-section glass-flat">
          <h2 className="tool-section-title">The photo</h2>
          <dl className="tool-specs">
            <div><dt>Size</dt><dd>{preset.size}</dd></div>
            <div><dt>Pixels</dt><dd>{px.width} × {px.height}</dd></div>
            <div><dt>Resolution</dt><dd>{DPI} DPI</dd></div>
            <div><dt>Print sheet</dt><dd>{sheet.count} photos on {printSheet.widthIn} × {printSheet.heightIn} in</dd></div>
          </dl>
          <p className="tool-section-note">{preset.use}</p>
        </section>

        <section className="tool-section glass-flat">
          <h2 className="tool-section-title">Questions</h2>
          <div className="tool-faq">
            {tool.faq.map((item) => (
              <details key={item.q} className="tool-faq-item">
                <summary>{item.q}</summary>
                <p>{richText(item.a)}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};

export default PassportPhotoPage;
