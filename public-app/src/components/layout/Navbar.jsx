import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu,
    ChevronRight,
    ArrowRight,
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
    const menuId = useId();
    const headerRef = useRef(null);
    const toggleRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 14);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        if (!mobileOpen) return;

        const desktop = window.matchMedia('(min-width: 1191px)');
        const closeOnDesktop = () => {
            if (desktop.matches) setMobileOpen(false);
        };
        const closeOnOutsidePress = (event) => {
            if (!headerRef.current?.contains(event.target)) setMobileOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;
            setMobileOpen(false);
            toggleRef.current?.focus();
        };

        desktop.addEventListener('change', closeOnDesktop);
        document.addEventListener('pointerdown', closeOnOutsidePress);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            desktop.removeEventListener('change', closeOnDesktop);
            document.removeEventListener('pointerdown', closeOnOutsidePress);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [mobileOpen]);

    const isPathActive = (paths = []) =>
        paths.some((p) => location.pathname === p || (p !== '/' && location.pathname.startsWith(`${p}/`)));

    const closeMenus = () => {
        setMobileOpen(false);
    };

    return (
        <header ref={headerRef} className={`rk-header-wrap ${scrolled ? 'is-scrolled' : ''}`}>
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
                            ref={toggleRef}
                            className="rk-mobile-toggle"
                            aria-controls={menuId}
                            onClick={() => setMobileOpen((prev) => !prev)}
                            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                            aria-expanded={mobileOpen}
                        >
                            <span className="rk-mobile-toggle-icons" aria-hidden="true">
                                <Menu size={20} className="rk-toggle-open" />
                                <X size={20} className="rk-toggle-close" />
                            </span>
                        </button>
                    </div>
                </nav>

                <nav id={menuId} className="rk-mobile-drawer" aria-label="Menu ROKABA" data-open={mobileOpen} inert={!mobileOpen}>
                    <ul className="rk-mobile-links">
                        {PRIMARY_ITEMS.map(({ path, matchPaths, label, icon: Icon }) => {
                            const active = isPathActive(matchPaths);
                            return (
                                <li key={path}>
                                    <Link
                                        to={path}
                                        className={`rk-mobile-link ${active ? 'is-active' : ''}`}
                                        aria-current={active ? 'page' : undefined}
                                        onClick={closeMenus}
                                    >
                                        <span className="rk-mobile-link-icon"><Icon size={17} aria-hidden="true" /></span>
                                        <span>{label}</span>
                                        <ChevronRight className="rk-mobile-link-arrow" size={15} aria-hidden="true" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="rk-mobile-footer">
                        <Link to="/contact" className="rk-btn-primary rk-mobile-contact"
                            aria-current={isPathActive(['/contact', '/kontak']) ? 'page' : undefined}
                            onClick={closeMenus}>
                            <Mail size={17} aria-hidden="true" />
                            <span>Hubungi kami</span>
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
