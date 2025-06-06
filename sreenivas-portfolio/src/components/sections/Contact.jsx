import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import '../../styles/components/contact.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(''), 3000);
    }, 1000);
  };

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <form 
      ref={ref}
      className={`contact-form ${inView ? 'animate-in' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className="form-header">
        <h3>Send me a message</h3>
        <p>Let's discuss your next AI project</p>
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="What's this about?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          placeholder="Tell me about your project or how we can collaborate..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Sending...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane"></i>
            Send Message
          </>
        )}
      </button>

      {submitStatus === 'success' && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          Message sent successfully! I'll get back to you soon.
        </div>
      )}
    </form>
  );
};

const Contact = () => {
  const { ref: sectionRef, inView: sectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      label: 'Email',
      value: 'your.email@gmail.com',
      link: 'mailto:your.email@gmail.com'
    },
    {
      icon: 'fas fa-phone',
      label: 'Phone',
      value: '+91 9019684624',
      link: 'tel:+919019684624'
    },
    {
      icon: 'fas fa-map-marker-alt',
      label: 'Location',
      value: 'Bangalore, India',
      link: 'https://maps.google.com/?q=Bangalore,India'
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="contact" ref={sectionRef} className={`section contact-section ${sectionInView ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-paper-plane"></i>
          Let's Build the Future Together
        </h2>

        <div className="contact-intro">
          <p>
            Ready to discuss AI innovations, collaborate on exciting projects, or explore new opportunities? 
            I'm always excited to connect with fellow technologists, potential collaborators, and innovative companies.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-details">
              <h3>Get in Touch</h3>
              <div className="contact-methods">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.link}
                    className="contact-method"
                    target={contact.link.startsWith('http') ? '_blank' : '_self'}
                    rel={contact.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    <div className="contact-icon">
                      <i className={contact.icon}></i>
                    </div>
                    <div className="contact-text">
                      <div className="contact-label">{contact.label}</div>
                      <div className="contact-value">{contact.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="social-links">
              <h3>Connect With Me</h3>
              <div className="social-grid">
                {/* Hardcoded social links to ensure they work */}
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': '#0077B5' }}
                >
                  <i className="fab fa-linkedin"></i>
                  <span className="social-text">LinkedIn</span>
                </a>
                
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': '#181717' }}
                >
                  <i className="fab fa-github"></i>
                  <span className="social-text">GitHub</span>
                </a>
                
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': '#1DA1F2' }}
                >
                  <i className="fab fa-twitter"></i>
                  <span className="social-text">Twitter</span>
                </a>
                
                <a
                  href="https://yourblog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': '#FF6B6B' }}
                >
                  <i className="fas fa-blog"></i>
                  <span className="social-text">Blog</span>
                </a>
              </div>
            </div>

            <div className="availability">
              <div className="availability-status">
                <div className="status-indicator available"></div>
                <div className="status-text">
                  <div className="status-label">Available for</div>
                  <div className="status-value">New Opportunities</div>
                </div>
              </div>
              <div className="availability-details">
                <ul>
                  <li><i className="fas fa-check"></i> AI/ML Engineering Roles</li>
                  <li><i className="fas fa-check"></i> Freelance Projects</li>
                  <li><i className="fas fa-check"></i> Technical Consulting</li>
                  <li><i className="fas fa-check"></i> Collaboration Opportunities</li>
                </ul>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="contact-cta">
          <div className="cta-content">
            <h3>Ready to innovate together?</h3>
            <p>
              Whether you're looking to build AI solutions, optimize existing systems, 
              or explore the possibilities of automation, let's make it happen.
            </p>
            <div className="cta-actions">
              <a href="mailto:your.email@gmail.com" className="btn btn-primary">
                <i className="fas fa-envelope"></i>
                Start a Conversation
              </a>
              <a 
                href="#projects" 
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#projects');
                }}
              >
                <i className="fas fa-eye"></i>
                View My Work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;