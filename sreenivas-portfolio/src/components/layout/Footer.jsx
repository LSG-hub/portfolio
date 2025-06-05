import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/yourusername', name: 'LinkedIn' },
    { icon: 'fab fa-github', url: 'https://github.com/yourusername', name: 'GitHub' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com/yourusername', name: 'Twitter' },
    { icon: 'fas fa-envelope', url: 'mailto:your.email@gmail.com', name: 'Email' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-text">SG</span>
                <span className="logo-accent">.AI</span>
              </div>
              <p className="footer-tagline">
                Building the future with Artificial Intelligence
              </p>
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
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

            {/* Quick Links */}
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map((link, index) => (
                  <li key={index}>
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

            {/* Contact Info */}
            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <div className="contact-items">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:your.email@gmail.com">your.email@gmail.com</a>
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

            {/* Newsletter/CTA */}
            <div className="footer-cta">
              <h4>Let's Connect</h4>
              <p>
                Interested in AI/ML collaboration or have a project in mind? 
                Let's build something amazing together!
              </p>
              <a href="#contact" className="footer-cta-btn" onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contact');
              }}>
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

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, var(--darker-bg) 0%, var(--darkest-bg) 100%);
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
          margin-top: 2rem;
        }

        .footer-content {
          padding: 3rem 0 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-brand .footer-logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .logo-text {
          color: var(--text-primary);
        }

        .logo-accent {
          color: var(--primary-color);
          margin-left: 2px;
        }

        .footer-tagline {
          margin-bottom: 1.5rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(0, 255, 150, 0.1);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--primary-color);
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: var(--primary-color);
          color: var(--dark-bg);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
        }

        .footer-links h4,
        .footer-contact h4,
        .footer-cta h4 {
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .footer-links ul {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--primary-color);
        }

        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-item i {
          color: var(--primary-color);
          width: 16px;
        }

        .contact-item a,
        .contact-item span {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-item a:hover {
          color: var(--primary-color);
        }

        .footer-cta p {
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .footer-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 255, 150, 0.3);
        }

        .footer-bottom {
          padding: 1.5rem 0;
          border-top: 1px solid var(--border-color);
          background: rgba(0, 0, 0, 0.2);
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .copyright p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer-tech {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer-tech i {
          color: var(--primary-color);
        }

        .footer-tech .fa-react {
          color: #61DAFB;
        }

        .footer-tech .fa-heart {
          color: #e74c3c;
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-social {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;