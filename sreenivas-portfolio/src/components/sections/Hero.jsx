import React, { useMemo } from 'react';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import '../../styles/components/hero.css';

const Hero = () => {
  const titles = useMemo(() => [
    'AI/ML Engineer',
    'Agentic AI Architect',
    'LangGraph Specialist',
    'LLM Systems Builder'
  ], []);

  const displayText = useTypingEffect(titles);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-grid"></div>
        <div className="hero-particles"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-greeting">
            <span className="wave">👋</span>
            <span>Hello, I'm</span>
          </div>
          
          <h1 className="hero-name">
            <span className="name-text">Sreenivas Gurram</span>
            <div className="name-glow"></div>
          </h1>
          
          <div className="hero-title">
            <span className="title-prefix">I'm a </span>
            <span className="title-dynamic">
              {displayText}
              <span className="cursor">|</span>
            </span>
          </div>
          
          <p className="hero-description">
            AI/ML Engineer specializing in <strong>Agentic Workflows</strong>, <strong>LangGraph orchestration</strong>, and <strong>LLM optimization</strong>.
            I architect enterprise <strong>MCP gateways</strong> managing <strong>100K+ daily requests</strong> and build cost-efficient
            autonomous systems that solve complex, unstructured problems at scale.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Daily Requests</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">70%</div>
              <div className="stat-label">Context Reduction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Top 3</div>
              <div className="stat-label">Google Cloud Agentic AI Day</div>
            </div>
          </div>
          
          <div className="hero-cta">
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('projects')}
            >
              <i className="fas fa-rocket"></i>
              View My Work
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => scrollToSection('contact')}
            >
              <i className="fas fa-envelope"></i>
              Get In Touch
            </button>
          </div>
          
          <div className="hero-scroll">
            <div className="scroll-indicator" onClick={() => scrollToSection('experience')}>
              <span>Scroll to explore</span>
              <div className="scroll-arrow">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="ai-brain">
            <div className="brain-core">
              <div className="neural-nodes">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`node node-${i + 1}`}>
                    <div className="node-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="brain-connections">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`connection connection-${i + 1}`}></div>
                ))}
              </div>
            </div>
            <div className="brain-glow"></div>
          </div>
          
          <div className="floating-elements">
            <div className="floating-icon" style={{ '--delay': '0s' }}>
              <i className="fas fa-robot"></i>
            </div>
            <div className="floating-icon" style={{ '--delay': '1s' }}>
              <i className="fas fa-brain"></i>
            </div>
            <div className="floating-icon" style={{ '--delay': '2s' }}>
              <i className="fas fa-code"></i>
            </div>
            <div className="floating-icon" style={{ '--delay': '3s' }}>
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;