import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { projectsData, projectCategories } from '../../data/projects';
import '../../styles/components/projects.css';

const ProjectCard = ({ project, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      ref={ref}
      className={`project-card ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="project-header">
        <div className="project-title-section">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <span className="project-category">{project.category}</span>
        </div>
        <div className="project-status">
          <span className={`status-badge ${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="project-description">
        <p>{isExpanded ? project.detailedDescription : project.description}</p>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {isExpanded && (
        <div className="project-features">
          <h4>Key Features</h4>
          <ul>
            {project.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="project-metrics">
        {Object.entries(project.metrics).map(([key, value]) => (
          <div key={key} className="metric-item">
            <div className="metric-value">{value}</div>
            <div className="metric-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>
        ))}
      </div>

      <div className="project-technologies">
        <div className="tech-stack">
          {project.technologies.map((tech, i) => (
            <span key={i} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>

      <div className="project-actions">
        {project.github && (
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link github"
          >
            <i className="fab fa-github"></i>
            View Code
          </a>
        )}
        {project.demo && (
          <a 
            href={project.demo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link demo"
          >
            <i className="fas fa-external-link-alt"></i>
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const filteredProjects = activeCategory === 'All' 
    ? projectsData 
    : projectsData.filter(project => project.category === activeCategory);

  return (
    <section id="projects" ref={sectionRef} className={`section projects-section ${sectionInView ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-code"></i>
          Featured Projects
        </h2>

        <div className="projects-filter">
          {projectCategories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="no-projects">
            <i className="fas fa-search"></i>
            <p>No projects found in this category.</p>
          </div>
        )}

        <div className="projects-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-number">{projectsData.length}</div>
              <div className="stat-label">Total Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">80%</div>
              <div className="stat-label">Avg. Efficiency Gain</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Technologies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;