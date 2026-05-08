import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import '../../styles/components/navbar.css';

const NAV_ITEMS = [
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'achievements', label: 'Recognition' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' }
];

const SECTION_IDS = ['home', ...NAV_ITEMS.map((item) => item.id)];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(20);
  const activeSection = useScrollSpy(SECTION_IDS);
  const location = useLocation();
  const navigate = useNavigate();

  const isOnHome = location.pathname === '/';

  const handleNavClick = (id) => {
    setIsMobileMenuOpen(false);
    if (isOnHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="nav-logo">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="nav-logo-text">Sreenivas Gurram</span>
          </Link>
        </div>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                type="button"
                className={`nav-link ${isOnHome && activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
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
