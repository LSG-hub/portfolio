import React from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';

const ScrollToTop = () => {
  const isVisible = useScrollPosition(300);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
};

export default ScrollToTop;
