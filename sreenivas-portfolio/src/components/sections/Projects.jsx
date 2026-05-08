import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { projectsData } from '../../data/projects';
import '../../styles/components/projects.css';

const ProjectCard = ({ project, index }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const num = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={`/projects/${project.slug}`}
      ref={ref}
      className={`project-card glass fade-in ${inView ? 'is-visible' : ''}`}
    >
      <div
        className="project-card-image"
        style={{ background: project.gradient }}
        aria-hidden="true"
      >
        <span className="project-card-num">{num}</span>
        <span className="project-card-watermark">{project.title}</span>
      </div>

      <div className="project-card-body">
        <span className="eyebrow">{project.tagline}</span>
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-subtitle">{project.subtitle}</p>
        <p className="project-card-description">{project.description}</p>

        <div className="project-card-stack">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="project-card-tag">{tech}</span>
          ))}
          {project.technologies.length > 5 && (
            <span className="project-card-tag project-card-tag-more">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        <span className="project-card-cta">
          View project <span className="arrow">&rarr;</span>
        </span>
      </div>
    </Link>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header-num">01 / Selected Work</span>
        </div>

        <h2 className="section-title">Projects</h2>

        <div className="projects-grid">
          {projectsData.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
