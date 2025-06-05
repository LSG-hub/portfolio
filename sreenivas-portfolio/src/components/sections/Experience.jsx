import React from 'react';
import { useInView } from 'react-intersection-observer';
import { experienceData, educationData, certificationsData } from '../../data/experience';
import '../../styles/components/experience.css';

const ExperienceCard = ({ experience, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div 
      ref={ref}
      className={`experience-card ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="experience-header">
        <div className="experience-main">
          <h3 className="experience-title">{experience.title}</h3>
          <div className="experience-company">
            <i className="fas fa-building"></i>
            {experience.company}
          </div>
          <div className="experience-location">
            <i className="fas fa-map-marker-alt"></i>
            {experience.location}
          </div>
        </div>
        <div className="experience-meta">
          <div className="experience-duration">
            <i className="fas fa-calendar-alt"></i>
            {experience.duration}
          </div>
          <div className={`experience-type ${experience.type.toLowerCase()}`}>
            {experience.type}
          </div>
        </div>
      </div>

      <div className="experience-description">
        <p>{experience.description}</p>
      </div>

      <div className="experience-achievements">
        <h4>Key Achievements</h4>
        <ul>
          {experience.achievements.map((achievement, i) => (
            <li key={i}>{achievement}</li>
          ))}
        </ul>
      </div>

      <div className="experience-highlights">
        {Object.entries(experience.highlights).map(([key, value]) => (
          <div key={key} className="highlight-item">
            <div className="highlight-value">{value}</div>
            <div className="highlight-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>
        ))}
      </div>

      <div className="experience-technologies">
        <h4>Technologies Used</h4>
        <div className="tech-tags">
          {experience.technologies.map((tech, i) => (
            <span key={i} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const EducationCard = ({ education }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div ref={ref} className={`education-card ${inView ? 'animate-in' : ''}`}>
      <div className="education-header">
        <div className="education-icon">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <div className="education-details">
          <h3 className="education-degree">{education.degree}</h3>
          <div className="education-institution">
            <i className="fas fa-university"></i>
            {education.institution}
          </div>
          <div className="education-location">
            <i className="fas fa-map-marker-alt"></i>
            {education.location}
          </div>
        </div>
        <div className="education-meta">
          <div className="education-duration">{education.duration}</div>
          <div className="education-cgpa">CGPA: {education.cgpa}</div>
          <div className="education-status">{education.status}</div>
        </div>
      </div>

      <div className="education-courses">
        <h4>Relevant Coursework</h4>
        <div className="course-tags">
          {education.relevantCourses.map((course, i) => (
            <span key={i} className="course-tag">{course}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const CertificationCard = ({ certification, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div 
      ref={ref}
      className={`certification-card ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="certification-header">
        <div className="certification-icon">
          <i className="fas fa-certificate"></i>
        </div>
        <div className="certification-details">
          <h4 className="certification-title">{certification.title}</h4>
          <div className="certification-issuer">{certification.issuer}</div>
          <div className="certification-date">{certification.date}</div>
        </div>
      </div>

      <div className="certification-description">
        <p>{certification.description}</p>
      </div>

      <div className="certification-skills">
        <div className="skill-tags">
          {certification.skills.map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section id="experience" ref={sectionRef} className={`section experience-section ${sectionInView ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-briefcase"></i>
          Professional Journey
        </h2>

        <div className="experience-content">
          {/* Work Experience */}
          <div className="experience-subsection">
            <h3 className="subsection-title">
              <i className="fas fa-laptop-code"></i>
              Work Experience
            </h3>
            <div className="experience-timeline">
              {experienceData.map((experience, index) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="experience-subsection">
            <h3 className="subsection-title">
              <i className="fas fa-graduation-cap"></i>
              Education
            </h3>
            <div className="education-grid">
              {educationData.map((education) => (
                <EducationCard key={education.id} education={education} />
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="experience-subsection">
            <h3 className="subsection-title">
              <i className="fas fa-award"></i>
              Workshops & Certifications
            </h3>
            <div className="certifications-grid">
              {certificationsData.map((certification, index) => (
                <CertificationCard 
                  key={certification.id} 
                  certification={certification}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;