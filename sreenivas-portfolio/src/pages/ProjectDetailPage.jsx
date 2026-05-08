import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getProjectBySlug } from '../data/projects';
import { richText } from '../utils/richText';
import '../styles/components/project-detail.css';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const hasImage = Boolean(project.image);

  return (
    <article className="project-detail">
      <div className="container-narrow">
        <Link to="/" className="project-detail-back">
          <span className="arrow">&larr;</span> Back to portfolio
        </Link>

        <header className="project-detail-header">
          <span className="eyebrow">{project.tagline}</span>
          <h1 className="project-detail-title">{project.title}</h1>
          <p className="project-detail-subtitle">{project.subtitle}</p>
        </header>

        <div
          className={`project-detail-hero ${hasImage ? 'project-detail-hero-photo' : ''}`}
          style={hasImage
            ? { backgroundImage: `url(${project.image})` }
            : { backgroundImage: project.gradient }}
          role={hasImage ? 'img' : undefined}
          aria-label={hasImage ? project.imageAlt : undefined}
        >
          {!hasImage && (
            <div className="project-detail-placeholder">
              <span className="project-detail-placeholder-num">
                {String(project.id).padStart(2, '0')}
              </span>
              <span className="project-detail-placeholder-text">{project.title}</span>
              <span className="project-detail-placeholder-sub">{project.subtitle}</span>
            </div>
          )}
        </div>

        <section className="project-detail-section glass-flat">
          <h2 className="project-detail-section-title">Overview</h2>
          <p className="project-detail-prose">{richText(project.detailedDescription)}</p>
        </section>

        <section className="project-detail-section glass-flat">
          <h2 className="project-detail-section-title">What I built</h2>
          <div className="numbered-list">
            {project.features.map((feature, i) => (
              <div key={i} className="numbered-item">
                <span className="numbered-item-num">{ROMAN[i] || i + 1}</span>
                <p className="numbered-item-text">{richText(feature)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="project-detail-section glass-flat">
          <h2 className="project-detail-section-title">Highlights</h2>
          <dl className="project-detail-metrics">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div className="project-detail-metric" key={key}>
                <dt>{formatLabel(key)}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <section className="project-detail-gallery">
            {project.gallery.map((item, i) => (
              <figure key={i} className="project-detail-gallery-item">
                <div
                  className="project-detail-gallery-image"
                  role="img"
                  aria-label={item.alt}
                  style={{ backgroundImage: `url(${item.src})` }}
                />
                {item.caption && (
                  <figcaption className="project-detail-gallery-caption">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}

        <section className="project-detail-section glass-flat">
          <h2 className="project-detail-section-title">Stack</h2>
          <div className="project-detail-stack">
            {project.technologies.map((tech) => (
              <span key={tech} className="project-detail-tag">{tech}</span>
            ))}
          </div>
        </section>

        {(project.demo || project.github) && (
          <div className="project-detail-cta">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-link primary"
              >
                Watch demo <span className="arrow">&rarr;</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-link"
              >
                View code <span className="arrow">&rarr;</span>
              </a>
            )}
          </div>
        )}

        <div className="project-detail-footer">
          <Link to="/#projects" className="project-detail-back">
            <span className="arrow">&larr;</span> Back to all projects
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectDetailPage;
