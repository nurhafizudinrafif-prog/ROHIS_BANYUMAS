import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
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
      </Routes>
      <Footer />
      <FloatingButtons />
    </Router>
  );
}

export default App;
