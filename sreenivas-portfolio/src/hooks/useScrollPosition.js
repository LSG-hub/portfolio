import { useEffect, useState } from 'react';

export const useScrollPosition = (threshold = 0) => {
  const [isPast, setIsPast] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > threshold : false
  );

  useEffect(() => {
    let rafId = null;
    let pending = false;

    const check = () => {
      const past = window.scrollY > threshold;
      setIsPast((prev) => (prev === past ? prev : past));
      pending = false;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return isPast;
};
