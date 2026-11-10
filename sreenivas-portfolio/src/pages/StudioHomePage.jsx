import React from 'react';
import { Link } from 'react-router-dom';
import { photoPurposes, studio, studioFaq } from '../data/studio';
import { formatSize } from '../utils/photoExport';
import { studioHomeMeta } from '../utils/seo';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/components/studio.css';

/** Millimetres to drawing units, shared by the document shapes so they keep their true proportions to each other. */
const MM = 2.1;

/** A small person, drawn into any shape so each card reads as "a photo of you". */
const Sitter = ({ x, y, w, h, clip }) => {
  const cx = x + w / 2;
  const headR = Math.min(w, h) * 0.2;
  const headY = y + h * 0.42;
  return (
    <g clipPath={clip}>
      <circle className="purpose-sitter" cx={cx} cy={headY} r={headR} />
      <path
        className="purpose-sitter"
        d={`M ${x + w * 0.12} ${y + h} C ${x + w * 0.14} ${headY + headR * 1.5}, ${x + w * 0.86} ${headY + headR * 1.5}, ${x + w * 0.88} ${y + h} Z`}
      />
    </g>
  );
};

const PurposeShape = ({ purpose }) => {
  const id = `shape-${purpose.slug}`;
  if (purpose.guide.kind === 'circle') {
    return (
      <svg className="purpose-shape" viewBox="0 0 120 120" aria-hidden="true">
        <defs><clipPath id={id}><circle cx="60" cy="60" r="44" /></clipPath></defs>
        <circle className="purpose-shape-fill" cx="60" cy="60" r="44" />
        <Sitter x={16} y={16} w={88} h={88} clip={`url(#${id})`} />
        <circle className="purpose-shape-edge" cx="60" cy="60" r="44" />
      </svg>
    );
  }
  const w = purpose.editable ? 64 : purpose.size.width * MM;
  const h = purpose.editable ? 84 : purpose.size.height * MM;
  const x = (120 - w) / 2;
  const y = (120 - h) / 2;
  return (
    <svg className="purpose-shape" viewBox="0 0 120 120" aria-hidden="true">
      <defs><clipPath id={id}><rect x={x} y={y} width={w} height={h} rx="2" /></clipPath></defs>
      <rect className="purpose-shape-fill" x={x} y={y} width={w} height={h} rx="2" />
      <Sitter x={x} y={y} w={w} h={h} clip={`url(#${id})`} />
      <rect className={`purpose-shape-edge ${purpose.editable ? 'is-dashed' : ''}`} x={x} y={y} width={w} height={h} rx="2" />
    </svg>
  );
};

const StudioHomePage = () => {
  usePageMeta(studioHomeMeta(studio));

  return (
    <div className="studio-home">
      <header className="studio-home-head">
        <h1 className="studio-home-title">{studio.title}</h1>
        <p className="studio-home-lede">{studio.lede}</p>
      </header>

      <ul className="purpose-grid">
        {photoPurposes.map((p) => (
          <li key={p.slug}>
            <Link to={`/studio/photo/${p.slug}/`} className="purpose-card">
              <PurposeShape purpose={p} />
              <span className="purpose-card-name">{p.name}</span>
              <span className="purpose-card-size">{p.editable ? 'mm · in · px · KB' : formatSize(p.size)}</span>
              <span className="purpose-card-use">{p.use}</span>
              <span className="purpose-card-go">
                Start <span className="arrow">&rarr;</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="studio-faq" aria-label="Questions">
        {studioFaq.map((item) => (
          <details key={item.q} className="studio-faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
};

export default StudioHomePage;
