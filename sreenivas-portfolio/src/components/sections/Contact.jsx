import React from 'react';
import { profile } from '../../data/profile';
import { richText } from '../../utils/richText';
import '../../styles/components/contact.css';

const SOCIALS = profile.socials;

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-header-num">05 / Get in Touch</span>
        </div>

        <h2 className="section-title">Contact</h2>

        <div className="contact-card glass-flat">
          <p className="contact-intro">{richText(profile.contactIntro)}</p>

          <div className="contact-list">
            <div className="contact-row">
              <span className="contact-label">Email</span>
              <a href={`mailto:${profile.email}`} className="contact-value">
                {profile.email}
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
                {social.label} <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
