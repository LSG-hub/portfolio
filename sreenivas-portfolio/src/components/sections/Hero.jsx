import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/hero.css';

const HERO_PHOTO = null;
const HERO_PHOTO_ALT = 'Portrait of Sreenivas Gurram';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <span className="eyebrow">Portfolio &middot; 2026</span>

        <div className="hero-top">
          <div className="hero-top-text">
            <h1 className="hero-name">Sreenivas Gurram</h1>
            <p className="hero-role">
              <em>AI/ML Engineer</em> &middot; Agentic Workflows, LangGraph, MCP
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
          <p className="hero-bio">
            I architect enterprise agentic AI infrastructure &mdash; multi-model
            orchestration, <strong>MCP</strong> gateways, and real-time collaborative
            workflow builders. Currently <strong>Associate Technical Specialist at
            DigitalAPI.ai</strong>, where I lead architecture for systems handling
            <strong> 10K+ daily requests</strong>.
          </p>

          <div className="hero-meta">
            <div className="hero-meta-row">
              <span className="hero-meta-label">Recognition</span>
              <span className="hero-meta-value">
                2nd Runner-Up, Google Cloud Agentic AI Day 2025 (1,941 developers, 700+ teams)
              </span>
            </div>
            <div className="hero-meta-row">
              <span className="hero-meta-label">Research</span>
              <span className="hero-meta-value">
                Co-author, NCAIT-2025 &mdash; agentic IDE architecture
              </span>
            </div>
            <div className="hero-meta-row">
              <span className="hero-meta-label">Location</span>
              <span className="hero-meta-value">
                Bangalore, India &mdash; open to AI/ML engineering roles
              </span>
            </div>
          </div>

          <div className="hero-cta">
            <a href="mailto:srinu202012@gmail.com" className="glass-link primary">
              Get in touch <span className="arrow">&rarr;</span>
            </a>
            <Link to="/projects/juno" className="glass-link">
              See my best work <span className="arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
