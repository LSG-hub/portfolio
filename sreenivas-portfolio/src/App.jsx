import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles/components/glass.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import TukRibbon from './components/avatar/TukRibbon';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
// Development bench for the avatar's physics. Reachable but unlinked, and
// disallowed in robots.txt so it stays out of search results.
const AvatarLab = lazy(() => import('./pages/AvatarLab'));
const WorldLab = lazy(() => import('./pages/WorldLab'));

const SectionFallback = () => <div className="section-fallback" aria-hidden />;

/**
 * The labs have their own worlds for him to stand in, and a second Tuk on the
 * page would harvest their platforms too. Prefix match, so any future lab route
 * nested under these is covered.
 */
const RIBBON_EXCLUDED = ['/avatar-lab', '/world-lab'];

const RibbonGate = () => {
  const { pathname } = useLocation();
  if (RIBBON_EXCLUDED.some((p) => pathname.startsWith(p))) return null;
  return <TukRibbon />;
};

const ScrollRestore = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, hash]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollRestore />
      <div className="App">
        <Navbar />
        <main>
          <Suspense fallback={<SectionFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/avatar-lab" element={<AvatarLab />} />
              <Route path="/world-lab" element={<WorldLab />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ScrollToTop />
        <RibbonGate />
      </div>
    </BrowserRouter>
  );
}

export default App;
