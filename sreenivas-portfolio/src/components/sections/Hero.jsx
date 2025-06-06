import React, { useEffect, useState, useMemo } from 'react';
import '../../styles/components/hero.css';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Move titles array inside useMemo to prevent re-creation on every render
  const titles = useMemo(() => [
    'AI/ML Engineer',
    'Data Science Innovator',
    'Generative AI Specialist',
    'Automation Expert'
  ], []);

  useEffect(() => {
    const currentTitle = titles[currentTextIndex];
    
    if (isTyping) {
      if (displayText.length < currentTitle.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % titles.length);
        setIsTyping(true);
      }
    }
  }, [displayText, currentTextIndex, isTyping, titles]);

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
            Passionate about developing <strong>cutting-edge AI solutions</strong> that solve real-world challenges. 
            Specialized in <strong>Generative AI</strong>, <strong>NLP</strong>, and <strong>Agentic Workflows</strong> with hands-on experience 
            in reducing processing times by up to <strong>80%</strong> through intelligent automation.
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">80%</div>
              <div className="stat-label">Time Reduction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Process Improvement</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">AI Projects</div>
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