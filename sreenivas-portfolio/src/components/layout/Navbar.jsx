import React, { useState } from 'react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import '../../styles/components/navbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'fas fa-home' },
  { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
  { id: 'projects', label: 'Projects', icon: 'fas fa-code' },
  { id: 'skills', label: 'Skills', icon: 'fas fa-brain' },
  { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(50);
  const activeSection = useScrollSpy(SECTION_IDS);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <span className="logo-text">SG</span>
            <span className="logo-accent">.AI</span>
          </a>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="nav-item">
              <a
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
