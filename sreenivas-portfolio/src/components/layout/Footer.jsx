import React from 'react';
import '../../styles/components/footer.css';

const QUICK_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' }
];

const SOCIAL_LINKS = [
  { icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/in/sreenivas-gurram-363528289/', name: 'LinkedIn' },
  { icon: 'fab fa-github', url: 'https://github.com/LSG-hub', name: 'GitHub' },
  { icon: 'fab fa-twitter', url: 'https://x.com/SreenivasGurra3', name: 'Twitter' },
  { icon: 'fas fa-envelope', url: 'mailto:srinu202012@gmail.com', name: 'Email' }
];

const scrollToSection = (href) => {
  const element = document.getElementById(href.replace('#', ''));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-text">SG</span>
                <span className="logo-accent">.AI</span>
              </div>
              <p className="footer-tagline">
                Building the future with Artificial Intelligence
              </p>
              <div className="footer-social">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? '_self' : '_blank'}
                    rel={social.url.startsWith('mailto:') ? '' : 'noopener noreferrer'}
                    className="social-link"
                    aria-label={social.name}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <div className="contact-items">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:srinu202012@gmail.com">srinu202012@gmail.com</a>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:+919019684624">+91 9019684624</a>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Bangalore, India</span>
                </div>
              </div>
            </div>

            <div className="footer-cta">
              <h4>Let's Connect</h4>
              <p>
                Interested in AI/ML collaboration or have a project in mind?
                Let's build something amazing together!
              </p>
              <a
                href="#contact"
                className="footer-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contact');
                }}
              >
                <i className="fas fa-paper-plane"></i>
                Start a Project
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Sreenivas Gurram. Crafted with AI precision and human creativity.</p>
            </div>
            <div className="footer-tech">
              <span>Built with</span>
              <i className="fab fa-react" title="React"></i>
              <span>and</span>
              <i className="fas fa-heart" title="Love"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
