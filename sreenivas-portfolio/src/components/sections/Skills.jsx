import React from 'react';
import { useInView } from 'react-intersection-observer';
import { skillsData, languages } from '../../data/skills';
import '../../styles/components/skills.css';

const SkillGroup = ({ group }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} className={`skill-group fade-in ${inView ? 'is-visible' : ''}`}>
      <span className="skill-group-title">{group.title}</span>
      <div className="skill-group-items">
        {group.skills.map((skill) => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header-num">04 / Toolkit</span>
        </div>

        <h2 className="section-title">Skills</h2>

        <div className="skills-panel glass-flat">
          <div className="skills-list">
            {Object.entries(skillsData).map(([key, group]) => (
              <SkillGroup key={key} group={group} />
            ))}
          </div>

          <div className="languages-block">
            <span className="skill-group-title">Spoken</span>
            <div className="skill-group-items">
              {languages.map((lang) => (
                <span key={lang.name} className="skill-tag skill-tag-language">
                  {lang.name}
                  <span className="skill-tag-meta">{lang.level}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
