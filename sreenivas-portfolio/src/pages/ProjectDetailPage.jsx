import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getProjectBySlug } from '../data/projects';
import '../styles/components/project-detail.css';

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
          className="project-detail-hero glass"
          style={{ backgroundImage: project.gradient }}
        >
          {project.embed ? (
            <iframe
              src={project.embed}
              title={`${project.title} demo`}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="project-detail-embed"
            />
          ) : (
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
          <p className="project-detail-prose">{project.detailedDescription}</p>
        </section>

        <section className="project-detail-section glass-flat">
          <h2 className="project-detail-section-title">What I built</h2>
          <ul className="project-detail-features">
            {project.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
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
                View demo <span className="arrow">&rarr;</span>
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
