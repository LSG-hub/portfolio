import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { skillsData, softSkills, languages, interests } from '../../data/skills';
import '../../styles/components/skills.css';

const SkillBar = ({ skill, delay = 0 }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div 
      ref={ref}
      className={`skill-item ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="skill-header">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-percentage">{skill.level}%</span>
      </div>
      <div className="skill-bar">
        <div 
          className="skill-progress"
          style={{ 
            width: inView ? `${skill.level}%` : '0%',
            transition: `width 1.5s ease-out ${delay}s`
          }}
        ></div>
      </div>
      <div className="skill-description">{skill.description}</div>
    </div>
  );
};

const SkillCategory = ({ category, skills, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const displayedSkills = isExpanded ? skills : skills.slice(0, 4);

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
        {skills.length > 4 && (
          <button 
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : `+${skills.length - 4} More`}
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>
        )}
      </div>
      
      <div className="skills-list">
        {displayedSkills.map((skill, skillIndex) => (
          <SkillBar 
            key={skill.name} 
            skill={skill} 
            delay={skillIndex * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

const SoftSkillCard = ({ skill, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div 
      ref={ref}
      className={`soft-skill-card ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="soft-skill-icon">
        <i className={skill.icon}></i>
      </div>
      <h4 className="soft-skill-name">{skill.name}</h4>
      <p className="soft-skill-description">{skill.description}</p>
    </div>
  );
};

const InterestCard = ({ interest, index }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div 
      ref={ref}
      className={`interest-card ${inView ? 'animate-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="interest-icon">
        <i className={interest.icon}></i>
      </div>
      <h4 className="interest-name">{interest.name}</h4>
      <p className="interest-description">{interest.description}</p>
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
    { id: 'soft', label: 'Soft Skills', icon: 'fas fa-users' },
    { id: 'languages', label: 'Languages', icon: 'fas fa-globe' },
    { id: 'interests', label: 'Interests', icon: 'fas fa-heart' }
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
                    skills={category.skills}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'soft' && (
            <div className="soft-skills">
              <div className="soft-skills-grid">
                {softSkills.map((skill, index) => (
                  <SoftSkillCard
                    key={skill.name}
                    skill={skill}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'languages' && (
            <div className="languages-section">
              <div className="languages-grid">
                {languages.map((language, index) => (
                  <div key={language.name} className="language-item">
                    <div className="language-name">{language.name}</div>
                    <div className="language-level">{language.level}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="interests-section">
              <div className="interests-grid">
                {interests.map((interest, index) => (
                  <InterestCard
                    key={interest.name}
                    interest={interest}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="skills-summary">
          <div className="summary-text">
            <h3>Continuous Learning & Growth</h3>
            <p>
              My journey in AI/ML is driven by curiosity and the desire to solve complex problems. 
              I stay updated with the latest technologies and constantly expand my skill set to deliver 
              innovative solutions.
            </p>
          </div>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Technologies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3+</div>
              <div className="stat-label">Years Learning</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Growth Mindset</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;