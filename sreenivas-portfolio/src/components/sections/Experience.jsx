import React from 'react';
import { useInView } from 'react-intersection-observer';
import { experienceData, educationData } from '../../data/experience';
import '../../styles/components/experience.css';

const ExperienceCard = ({ experience }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <article ref={ref} className={`experience-card glass fade-in ${inView ? 'is-visible' : ''}`}>
      <header className="experience-header">
        <div className="experience-header-main">
          <h3 className="experience-title">{experience.title}</h3>
          <div className="experience-company">
            {experience.company}
            <span className="sep">&middot;</span>
            {experience.location}
          </div>
        </div>
        <span className="experience-duration">{experience.duration}</span>
      </header>

      <p className="experience-description">{experience.description}</p>

      <ul className="experience-achievements">
        {experience.achievements.map((achievement, i) => (
          <li key={i}>{achievement}</li>
        ))}
      </ul>

      <div className="experience-stack">
        <span className="experience-stack-label">Stack</span>
        <div className="experience-stack-tags">
          {experience.technologies.map((tech) => (
            <span key={tech} className="experience-stack-tag">{tech}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

const EducationCard = ({ education }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <article ref={ref} className={`education-card glass-flat fade-in ${inView ? 'is-visible' : ''}`}>
      <h3 className="education-degree">{education.degree}</h3>
      <div className="education-institution">
        {education.institution} <span className="sep">&middot;</span> {education.location}
      </div>
      <div className="education-meta">
        <span>{education.duration}</span>
        <span>CGPA {education.cgpa}</span>
        <span>{education.status}</span>
      </div>
    </article>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header-num">02 / Career</span>
        </div>

        <h2 className="section-title">Experience</h2>

        <div className="experience-list">
          {experienceData.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>

        <h3 className="experience-subsection-title">Education</h3>
        <div className="education-list">
          {educationData.map((education) => (
            <EducationCard key={education.id} education={education} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
