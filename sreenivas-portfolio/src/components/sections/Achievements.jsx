import React from 'react';
import { useInView } from 'react-intersection-observer';
import { achievementsData } from '../../data/experience';
import '../../styles/components/achievements.css';

const AchievementCard = ({ achievement }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <article
      ref={ref}
      className={`achievement-card glass-flat fade-in ${inView ? 'is-visible' : ''} ${achievement.image ? 'achievement-card-with-image' : ''}`}
    >
      {achievement.image && (
        <div
          className="achievement-image"
          role="img"
          aria-label={achievement.imageAlt}
          style={{ backgroundImage: `url(${achievement.image})` }}
        />
      )}

      <div className="achievement-body">
        <header className="achievement-header">
          <div className="achievement-header-main">
            <h3 className="achievement-title">{achievement.title}</h3>
            <div className="achievement-issuer">{achievement.issuer}</div>
          </div>
          <span className="achievement-date">{achievement.date}</span>
        </header>

        <p className="achievement-description">{achievement.description}</p>

        <div className="achievement-tags">
          {achievement.skills.map((skill) => (
            <span key={skill} className="achievement-tag">{skill}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

const Achievements = () => {
  return (
    <section id="achievements" className="section achievements-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header-num">03 / Recognition</span>
        </div>

        <h2 className="section-title">Achievements</h2>

        <div className="achievements-grid">
          {achievementsData.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
