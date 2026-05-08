import React from 'react';
import '../../styles/components/footer.css';

const FOOTER_LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sreenivas-gurram-363528289/' },
  { label: 'GitHub', url: 'https://github.com/LSG-hub' },
  { label: 'Email', url: 'mailto:srinu202012@gmail.com' }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-copyright">
            <em>&copy; {currentYear}</em> Sreenivas Gurram. Crafted in Bangalore.
          </span>
          <div className="footer-links">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                rel={link.url.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
