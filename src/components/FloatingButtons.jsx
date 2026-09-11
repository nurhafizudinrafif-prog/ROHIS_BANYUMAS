import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { InstagramIcon } from './InstagramSection';
import './FloatingButtons.css';

export default function FloatingButtons() {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="floating-buttons">
      <a
        href="https://www.instagram.com/rohis_banyumas/"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-instagram"
        aria-label="Instagram Resmi ROHIS Kabupaten Banyumas"
        title="Instagram @rohis_banyumas"
      >
        <InstagramIcon size={22} />
      </a>

      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-whatsapp"
        aria-label="Hubungi via WhatsApp"
        title="Chat WhatsApp"
      >
        <MessageCircle size={24} />
      </a>

      {showBackTop && (
        <button
          className="floating-btn floating-back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Kembali ke atas"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
