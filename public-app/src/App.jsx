import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

// Clean scroll restoration on route changes without any visual DOM flickering
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--deep-pine)' }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', background: 'var(--deep-pine)' }}>
        <Routes>
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
          <Route path="/tentang" element={<Navigate to="/" replace />} />
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
