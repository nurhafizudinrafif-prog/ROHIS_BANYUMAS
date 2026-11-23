import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    BookOpen,
    Image,
    House,
    Users,
    Newspaper,
    Mail,
} from 'lucide-react';

const PRIMARY_ITEMS = [
    { path: '/', matchPaths: ['/'], label: 'Beranda', icon: House },
    { path: '/about', matchPaths: ['/about', '/tentang'], label: 'Tentang', icon: Users },
    { path: '/berita', matchPaths: ['/berita'], label: 'Berita & Agenda', icon: Newspaper },
    { path: '/articles', matchPaths: ['/articles', '/artikel'], label: 'Artikel', icon: BookOpen },
    { path: '/gallery', matchPaths: ['/gallery', '/galeri'], label: 'Galeri Dokumentasi', icon: Image },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 14);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname, location.hash]);

    const isPathActive = (paths = []) =>
        paths.some((p) => location.pathname === p || (p !== '/' && location.pathname.startsWith(`${p}/`)));

    const closeMenus = () => {
        setMobileOpen(false);
    };

    return (
        <header className={`rk-header-wrap ${scrolled ? 'is-scrolled' : ''}`}>
            <div className="rk-container">
                <nav className="rk-navbar" aria-label="Navigasi utama ROKABA">
                    <Link to="/" className="rk-brand" aria-label="Beranda ROKABA">
                        <span className="rk-brand-logo-shell">
                            <img src="/logo.svg" alt="Logo ROHIS Kabupaten Banyumas" width="32" height="32" />
                        </span>
                        <span className="rk-brand-text">
                            <strong>ROKABA</strong>
                            <small>ROHIS Kabupaten Banyumas</small>
                        </span>
                    </Link>

                    <div className="rk-nav-links">
                        {PRIMARY_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = isPathActive(item.matchPaths);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`rk-nav-link ${active ? 'is-active' : ''}`}
                                    aria-current={active ? 'page' : undefined}
                                    onClick={closeMenus}
                                >
                                    <Icon size={15} className="rk-nav-link-icon" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="rk-nav-actions">
                        <Link to="/contact" className="rk-btn-primary rk-nav-cta">
                            <Mail size={15} />
                            <span>Hubungi kami</span>
                        </Link>
                        <button
                            type="button"
                            className="rk-mobile-toggle"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {mobileOpen && (
                    <div className="rk-mobile-drawer" role="dialog" aria-label="Menu mobile ROKABA">
                        <div className="rk-mobile-section">
                            <span className="rk-mobile-eyebrow">Navigasi Utama</span>
                            <div className="rk-mobile-links">
                                {PRIMARY_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    const active = isPathActive(item.matchPaths);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`rk-mobile-link ${active ? 'is-active' : ''}`}
                                            aria-current={active ? 'page' : undefined}
                                            onClick={closeMenus}
                                        >
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                                <Icon size={16} style={{ flexShrink: 0 }} />
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rk-mobile-footer">
                            <Link to="/contact" className="rk-btn-primary" style={{ width: '100%' }}>
                                <Mail size={16} />
                                Hubungi kami
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
