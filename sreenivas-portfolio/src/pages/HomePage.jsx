import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { homeMeta } from '../utils/seo';
import usePageMeta from '../hooks/usePageMeta';

import Hero from '../components/sections/Hero';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Achievements from '../components/sections/Achievements';
import Skills from '../components/sections/Skills';
import Contact from '../components/sections/Contact';

const HomePage = () => {
  const location = useLocation();
  usePageMeta(homeMeta(profile));

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash]);

  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Achievements />
      <Skills />
      <Contact />
    </>
  );
};

export default HomePage;
