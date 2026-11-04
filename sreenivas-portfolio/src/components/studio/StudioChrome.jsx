import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { studio } from '../../data/studio';
import { profile } from '../../data/profile';
import '../../styles/components/footer.css';
import '../../styles/components/studio-chrome.css';

/**
 * Pocket Studio's own app bar. The tools live on this domain but aren't the
 * portfolio, so it carries the studio's name, and on a photo page a way back to
 * choosing a different photo. Nothing in it that can't be clicked.
 */
export const StudioHeader = () => {
  const { pathname } = useLocation();
  const onPhotoPage = pathname.startsWith('/studio/photo/');
  return (
    <header className="studio-bar">
      <div className="studio-bar-inner">
        <Link to={studio.home} className="studio-logo">{studio.name}</Link>
        {onPhotoPage && (
          <Link to={studio.home} className="studio-bar-link">
            <span className="arrow">&larr;</span> Choose a different photo
          </Link>
        )}
      </div>
    </header>
  );
};

const LINKS = [
  { label: 'Portfolio', url: '/' },
  ...profile.socials.filter((s) => s.label === 'LinkedIn' || s.label === 'GitHub'),
  { label: 'Email', url: `mailto:${profile.email}` }
];

export const StudioFooter = () => (
  <footer className="footer studio-footer">
    <div className="studio-footer-inner">
      <span className="footer-copyright">
        <em>{studio.name}</em> is made by {profile.name}.
      </span>
      <div className="footer-links">
        {LINKS.map((link) => {
          const external = link.url.startsWith('http');
          return (
            <a
              key={link.label}
              href={link.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="footer-link"
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  </footer>
);
