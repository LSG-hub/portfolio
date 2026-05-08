import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <span className="eyebrow">Portfolio · 2026</span>
        <h1 className="hero-name">Sreenivas Gurram</h1>
        <p className="hero-role">
          <em>AI/ML Engineer</em> &middot; Agentic Workflows, LangGraph, MCP
        </p>

        <div className="hero-card glass">
          <p className="hero-bio">
            I architect enterprise agentic AI infrastructure &mdash; multi-model
            orchestration, <strong>MCP</strong> gateways, and real-time collaborative
            workflow builders. Currently <strong>Associate Technical Specialist at
            DigitalAPI.ai</strong>, where I lead architecture for systems managing
            <strong> 100K+ daily requests</strong>.
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
                Bangalore, India &mdash; open to senior AI/ML roles
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
