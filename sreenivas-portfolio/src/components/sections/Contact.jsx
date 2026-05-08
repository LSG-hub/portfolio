import React from 'react';
import '../../styles/components/contact.css';

const SOCIALS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/sreenivas-gurram-363528289/' },
  { label: 'GitHub', url: 'https://github.com/LSG-hub' },
  { label: 'Twitter', url: 'https://x.com/SreenivasGurra3' },
  { label: 'Blog', url: 'https://iotodyssey.blogspot.com/2024/11/the-iot-odyssey-from-smart-homes-to.html' }
];

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header-num">05 / Get in Touch</span>
        </div>

        <h2 className="section-title">Contact</h2>

        <div className="contact-card glass-flat">
          <p className="contact-intro">
            Open to <em>AI/ML engineering</em> roles, agentic-systems work, and research
            collaboration. Email is the fastest way to reach me &mdash; I respond within
            a day.
          </p>

          <div className="contact-list">
            <div className="contact-row">
              <span className="contact-label">Email</span>
              <a href="mailto:srinu202012@gmail.com" className="contact-value">
                srinu202012@gmail.com
              </a>
            </div>
            <div className="contact-row">
              <span className="contact-label">Phone</span>
              <a href="tel:+919019684624" className="contact-value">
                +91 9019684624
              </a>
            </div>
            <div className="contact-row">
              <span className="contact-label">Based in</span>
              <span className="contact-value contact-value-plain">Bangalore, India</span>
            </div>
          </div>

          <div className="contact-socials">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-link"
              >
                {social.label} <span className="arrow">&nearr;</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
