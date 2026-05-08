import React, { Suspense, lazy } from 'react';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import ScrollToTop from './components/common/ScrollToTop';

const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Contact = lazy(() => import('./components/sections/Contact'));

const SectionFallback = () => <div className="section-fallback" aria-hidden="true" />;

function App() {
  return (
    <div className="App">
      <Navbar />

      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </Suspense>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
