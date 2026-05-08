import { useEffect, useState } from 'react';

const MAX_ATTACH_FRAMES = 120;

export const useScrollSpy = (sectionIds, options = {}) => {
  const { rootMargin = '-30% 0px -65% 0px' } = options;
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    let cancelled = false;
    let rafId = null;
    let observer = null;
    let attempts = 0;

    const handleEntries = (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length === 0) return;
      const top = intersecting.reduce((a, b) =>
        a.target.getBoundingClientRect().top < b.target.getBoundingClientRect().top ? a : b
      );
      setActiveId(top.target.id);
    };

    const attach = () => {
      if (cancelled) return;

      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (elements.length < sectionIds.length && attempts < MAX_ATTACH_FRAMES) {
        attempts += 1;
        rafId = requestAnimationFrame(attach);
        return;
      }

      if (elements.length === 0) return;

      observer = new IntersectionObserver(handleEntries, { rootMargin, threshold: 0 });
      elements.forEach((el) => observer.observe(el));
    };

    attach();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, [sectionIds, rootMargin]);

  return activeId;
};
