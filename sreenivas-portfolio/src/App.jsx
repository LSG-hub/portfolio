import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles/components/glass.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import TukCorner from './components/avatar/TukCorner';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
// Development bench for the avatar's physics. Reachable but unlinked, and
// disallowed in robots.txt so it stays out of search results.
// The house, which used to be a strip on every page. Code-split: nobody who
// isn't looking for it pays for the room, the routine or the sky curve.
const TukPage = lazy(() => import('./pages/TukPage'));
const AvatarLab = lazy(() => import('./pages/AvatarLab'));
const WorldLab = lazy(() => import('./pages/WorldLab'));

const SectionFallback = () => <div className="section-fallback" aria-hidden />;

/**
 * Pages that already contain a Tuk. /tuk is the house and the labs have their own
 * worlds; a second instance would harvest their platforms too and there would be
 * two of him on screen. Prefix match, so nested routes are covered.
 */
const CORNER_EXCLUDED = ['/tuk', '/avatar-lab', '/world-lab'];

const CornerGate = () => {
  const { pathname } = useLocation();
  if (CORNER_EXCLUDED.some((p) => pathname.startsWith(p))) return null;
  return <TukCorner />;
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
              <Route path="/tuk" element={<TukPage />} />
              <Route path="/avatar-lab" element={<AvatarLab />} />
              <Route path="/world-lab" element={<WorldLab />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ScrollToTop />
        <CornerGate />
      </div>
    </BrowserRouter>
  );
}

export default App;
