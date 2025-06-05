import React, { useEffect } from 'react';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Section Components
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';

// Common Components
import CursorGlow from './components/common/CursorGlow';
import NeuralNetwork from './components/common/NeuralNetwork';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  useEffect(() => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    const timer = setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <CursorGlow />
      <NeuralNetwork />
      <Navbar />
      
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;