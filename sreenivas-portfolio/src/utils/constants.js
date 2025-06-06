// Personal Information
export const PERSONAL_INFO = {
  name: 'Sreenivas Gurram',
  title: 'AI/ML Engineer & Data Science Innovator',
  email: 'srinu202012@gmail.com',
  phone: '+91 9019684624',
  location: 'Bangalore, India',
  portfolio: 'https://portfolio-31jx.vercel.app/',
  tagline: 'Building the future with Artificial Intelligence'
};

// Social Media Links
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/sreenivas-gurram-363528289/',
  github: 'https://github.com/LSG-hub',
  twitter: 'https://x.com/SreenivasGurra3',
  email: 'mailto:srinu202012@gmail.com',
  phone: 'tel:+919019684624'
};

// Animation Delays
export const ANIMATION_DELAYS = {
  stagger: 0.1,
  card: 0.2,
  section: 0.3
};

// Intersection Observer Options
export const OBSERVER_OPTIONS = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// Color Themes
export const COLORS = {
  primary: '#00ff96',
  secondary: '#0066ff',
  accent: '#ff6b6b',
  dark: '#0a0a0a',
  darker: '#1a1a2e',
  darkest: '#16213e'
};

// Breakpoints
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1200px'
};

// Navigation Items
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'fas fa-home' },
  { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
  { id: 'projects', label: 'Projects', icon: 'fas fa-code' },
  { id: 'skills', label: 'Skills', icon: 'fas fa-brain' },
  { id: 'contact', label: 'Contact', icon: 'fas fa-envelope' }
];

// API Endpoints (if needed)
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter'
};

// SEO Meta Data
export const SEO_DATA = {
  title: 'Sreenivas Gurram - AI/ML Engineer Portfolio',
  description: 'Dynamic AI/ML specialist with proven track record in developing cutting-edge AI solutions. Specialized in Generative AI, NLP, and Agentic Workflows.',
  keywords: 'AI Engineer, Machine Learning, Data Science, Python, React, Portfolio, Sreenivas Gurram, Artificial Intelligence, NLP, Deep Learning',
  author: 'Sreenivas Gurram',
  ogImage: '/og-image.jpg',
  twitterImage: '/twitter-image.jpg'
};

// Form Validation Rules
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

// Skills Categories for filtering
export const SKILL_CATEGORIES = {
  AI_ML: 'AI/ML',
  PROGRAMMING: 'Programming',
  FRAMEWORKS: 'Frameworks',
  CLOUD: 'Cloud & DevOps',
  DATABASES: 'Databases',
  TOOLS: 'Tools'
};

// Project Status Types
export const PROJECT_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  PROTOTYPE: 'prototype',
  PLANNING: 'planning'
};

// Experience Types
export const EXPERIENCE_TYPES = {
  FULL_TIME: 'full-time',
  INTERNSHIP: 'internship',
  FREELANCE: 'freelance',
  CONTRACT: 'contract'
};

// Utility Functions
export const utils = {
  // Scroll to element
  scrollToElement: (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  // Format date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};