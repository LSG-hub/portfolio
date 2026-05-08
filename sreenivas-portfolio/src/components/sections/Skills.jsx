import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { skillsData, languages } from '../../data/skills';
import '../../styles/components/skills.css';

const SkillCategory = ({ category, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div
      ref={ref}
      className={`skill-category ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="category-header">
        <h3 className="category-title">
          <i className={category.icon}></i>
          {category.title}
        </h3>
      </div>

      <div className="tech-tags">
        {category.skills.map((skill, i) => (
          <span key={i} className="tech-tag">{skill}</span>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [activeTab, setActiveTab] = useState('technical');

  const tabs = [
    { id: 'technical', label: 'Technical Skills', icon: 'fas fa-code' },
    { id: 'languages', label: 'Spoken Languages', icon: 'fas fa-globe' }
  ];

  return (
    <section id="skills" ref={sectionRef} className={`section skills-section ${sectionInView ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-brain"></i>
          Skills & Expertise
        </h2>

        <div className="skills-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="skills-content">
          {activeTab === 'technical' && (
            <div className="technical-skills">
              <div className="skills-grid">
                {Object.entries(skillsData).map(([key, category], index) => (
                  <SkillCategory
                    key={key}
                    category={category}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'languages' && (
            <div className="languages-section">
              <div className="languages-grid">
                {languages.map((language) => (
                  <div key={language.name} className="language-item">
                    <div className="language-name">{language.name}</div>
                    <div className="language-level">{language.level}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
