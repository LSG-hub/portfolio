import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles/components/glass.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import TukCorner from './components/avatar/TukCorner';
import { StudioFooter, StudioHeader } from './components/studio/StudioChrome';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
// Development bench for the avatar's physics. Reachable but unlinked, and
// disallowed in robots.txt so it stays out of search results.
// The house, which used to be a strip on every page. Code-split: nobody who
// isn't looking for it pays for the room, the routine or the sky curve.
const TukPage = lazy(() => import('./pages/TukPage'));
const AvatarLab = lazy(() => import('./pages/AvatarLab'));
const WorldLab = lazy(() => import('./pages/WorldLab'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
// Pocket Studio, the free tools. Their own chunks, so the portfolio never downloads them.
const StudioHomePage = lazy(() => import('./pages/StudioHomePage'));
const PhotoStudioPage = lazy(() => import('./pages/PhotoStudioPage'));

const SectionFallback = () => <div className="section-fallback" aria-hidden />;

/**
 * Pages that already contain a Tuk. /tuk is the house and the labs have their own
 * worlds; a second instance would harvest their platforms too and there would be
 * two of him on screen. Prefix match, so nested routes are covered.
 */
const CORNER_EXCLUDED = ['/tuk', '/avatar-lab', '/world-lab'];

const CornerGate = () => {
  const { pathname } = useLocation();
  if (isStudio(pathname) || CORNER_EXCLUDED.some((p) => pathname.startsWith(p))) return null;
  return <TukCorner />;
};

/**
 * Pocket Studio (/studio/) lives on this domain but is not the portfolio: its own
 * header and footer, and no Tuk wandering over the controls.
 */
const isStudio = (pathname) => pathname === '/studio' || pathname.startsWith('/studio/');

const Header = () => (isStudio(useLocation().pathname) ? <StudioHeader /> : <Navbar />);
const SiteFooter = () => (isStudio(useLocation().pathname) ? <StudioFooter /> : <Footer />);

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
        <Header />
        <main>
          <Suspense fallback={<SectionFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/tuk" element={<TukPage />} />
              <Route path="/avatar-lab" element={<AvatarLab />} />
              <Route path="/world-lab" element={<WorldLab />} />
              <Route path="/studio" element={<StudioHomePage />} />
              <Route path="/studio/photo/:purpose" element={<PhotoStudioPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <SiteFooter />
        <CornerGate />
      </div>
    </BrowserRouter>
  );
}

export default App;
