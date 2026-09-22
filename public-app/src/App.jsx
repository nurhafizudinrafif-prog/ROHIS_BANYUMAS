import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Events from './pages/Events';
import Schools from './pages/Schools';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Consultation from './pages/Consultation';
import Library from './pages/Library';
import Programs from './pages/Programs';

function AdminRedirect() {
  useEffect(() => {
    window.location.href = 'https://rohis-banyumasadminid.vercel.app';
  }, []);
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--deep-pine)', color: 'var(--warm-alabaster)', textAlign: 'center', padding: '2rem' }}>
      <div>
        <h2 style={{ marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Membuka Portal Admin ROHIS Banyumas...</h2>
        <p style={{ opacity: 0.75, marginBottom: '1.5rem', fontSize: '0.95rem' }}>Anda sedang dialihkan ke panel kelola CMS...</p>
        <a href="https://rohis-banyumasadminid.vercel.app" className="btn btn-primary">
          Buka Panel Admin Sekarang
        </a>
      </div>
    </div>
  );
}

// Silky smooth crossfade page transition - zero dark flash, zero layout jump
function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const prevPathRef = useRef(location.pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    // Only animate on actual path changes
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;

    // Immediately scroll to top before visual update
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const el = containerRef.current;
    if (!el) return;

    // Gentle crossfade: opacity never drops low enough to cause a dark flash or reload feel
    el.style.transition = 'none';
    el.style.opacity = '0.85';
    el.style.transform = 'translateY(4px)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!el) return;
        el.style.transition = 'opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });

    // Handle hash anchors smoothly
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100%',
        width: '100%',
        background: 'var(--deep-pine)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--deep-pine)' }}>
      <Navbar />
      <main style={{ flex: 1, position: 'relative', background: 'var(--deep-pine)' }}>
        <PageTransition>
          <Routes location={location}>
            {/* Primary Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/library" element={<Library />} />

            {/* Backward-Compatible Indonesian URL Aliases */}
            <Route path="/tentang" element={<About />} />
            <Route path="/program" element={<Programs />} />
            <Route path="/agenda" element={<Events />} />
            <Route path="/artikel" element={<Articles />} />
            <Route path="/artikel/:slug" element={<ArticleDetail />} />
            <Route path="/rohis-anggota" element={<Schools />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/pendaftaran" element={<Contact />} />

            {/* Admin Portal Redirect Routes */}
            <Route path="/admin" element={<AdminRedirect />} />
            <Route path="/login" element={<AdminRedirect />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Router>
        <AppContent />
      </Router>
    </DataProvider>
  );
}
