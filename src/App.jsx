import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import ScrollToTop from './utils';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import DynamicBackground from './components/DynamicBackground';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Gallery from './pages/Gallery';
import Agenda from './pages/Agenda';
import MemberSchools from './pages/MemberSchools';
import Registration from './pages/Registration';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import CloudAgent from './pages/CloudAgent';

function AppContent() {
  const location = useLocation();
  const isStandalone = location.pathname.startsWith('/admin') || location.pathname.startsWith('/cloud-agent');

  return (
    <>
      <ScrollToTop />
      {/* Elegant & Living Dynamic Islamic Background */}
      <DynamicBackground />

      {!isStandalone && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/program" element={<Programs />} />
        <Route path="/artikel" element={<Articles />} />
        <Route path="/artikel/:slug" element={<ArticleDetail />} />
        <Route path="/galeri" element={<Gallery />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/rohis-anggota" element={<MemberSchools />} />
        <Route path="/pendaftaran" element={<Registration />} />
        <Route path="/kontak" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cloud-agent" element={<CloudAgent />} />
      </Routes>
      {!isStandalone && <Footer />}
      {!isStandalone && <FloatingButtons />}
    </>
  );
}

function App() {
  return (
    <DataProvider>
      <Router>
        <AppContent />
      </Router>
    </DataProvider>
  );
}

export default App;
