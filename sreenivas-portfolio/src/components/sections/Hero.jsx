import React from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { richText } from '../../utils/richText';
import '../../styles/components/hero.css';

const HERO_PHOTO = profile.photo;
const HERO_PHOTO_ALT = profile.photoAlt;

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <span className="eyebrow">Portfolio &middot; 2026</span>

        <div className="hero-top">
          <div className="hero-top-text">
            <h1 className="hero-name">{profile.name}</h1>
            <p className="hero-role">
              <em>{profile.role}</em> &middot; {profile.focus}
            </p>
          </div>

          {HERO_PHOTO ? (
            <div
              className="hero-portrait hero-portrait-photo"
              role="img"
              aria-label={HERO_PHOTO_ALT}
              style={{ backgroundImage: `url(${HERO_PHOTO})` }}
            />
          ) : (
            <div
              className="hero-portrait hero-portrait-placeholder"
              role="img"
              aria-label="Portrait placeholder"
            >
              <span className="hero-portrait-initials">SG</span>
              <span className="hero-portrait-meta">portrait soon</span>
            </div>
          )}
        </div>

        <div className="hero-card glass">
          <p className="hero-bio">{richText(profile.bio)}</p>

          <div className="hero-meta">
            {profile.facts.map((fact) => (
              <div className="hero-meta-row" key={fact.label}>
                <span className="hero-meta-label">{fact.label}</span>
                <span className="hero-meta-value">{fact.value}</span>
              </div>
            ))}
          </div>

          <div className="hero-cta">
            <a href={`mailto:${profile.email}`} className="glass-link primary">
              Get in touch <span className="arrow">&rarr;</span>
            </a>
            <Link to="/projects/juno/" className="glass-link">
              See my best work <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
