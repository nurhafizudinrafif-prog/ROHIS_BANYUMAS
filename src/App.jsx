import { useLayoutEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import SchoolDirectory from './pages/Schools';
import ErrorBoundary from './components/common/ErrorBoundary';
import GlassOptics from './components/GlassOptics';
import AmbientBackground from './components/AmbientBackground';

function PageContent({ children }) {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);
  const page = useRef(null);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;

    // Hash links and back/forward visits keep their existing scroll behavior.
    if (!hash && navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animation = page.current.animate?.([{ opacity: 0.42 }, { opacity: 1 }], {
      duration: 320,
      easing: 'cubic-bezier(.16,1,.3,1)',
    });
    return () => animation?.cancel();
  }, [pathname, hash, navigationType]);

  return <main id="main-content" ref={page} className="rk-page-content">{children}</main>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <div className="rk-site">
            <GlassOptics />
            <AmbientBackground />
            <div className="rk-board-shell">
              <Navbar />
              <PageContent>
                <Routes>
                  {/* Primary Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/schools" element={<SchoolDirectory />} />
                  <Route path="/berita" element={<News />} />
                  <Route path="/berita/:slug" element={<NewsDetail />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:slug" element={<ArticleDetail />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/consultation" element={<Navigate to="/contact" replace />} />
                  <Route path="/library" element={<Navigate to="/" replace />} />

                  {/* Backward-compatible URLs */}
                  <Route path="/news" element={<Navigate to="/berita" replace />} />
                  <Route path="/tentang" element={<Navigate to="/about" replace />} />
                  <Route path="/programs" element={<Navigate to="/about#program" replace />} />
                  <Route path="/program" element={<Navigate to="/about#program" replace />} />
                  <Route path="/events" element={<Navigate to="/berita#agenda" replace />} />
                  <Route path="/agenda" element={<Navigate to="/berita#agenda" replace />} />
                  <Route path="/artikel" element={<Articles />} />
                  <Route path="/artikel/:slug" element={<ArticleDetail />} />
                  <Route path="/anggota" element={<Navigate to="/schools" replace />} />
                  <Route path="/sekolah" element={<Navigate to="/schools" replace />} />
                  <Route path="/rohis-anggota" element={<Navigate to="/schools" replace />} />
                  <Route path="/galeri" element={<Gallery />} />
                  <Route path="/kontak" element={<Contact />} />
                  <Route path="/pendaftaran" element={<Contact />} />
                </Routes>
              </PageContent>
              <Footer />
            </div>
          </div>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  );
}
