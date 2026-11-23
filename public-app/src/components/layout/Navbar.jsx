import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    ChevronDown,
    BookOpen,
    Image,
    Phone,
    ArrowUpRight,
    Users,
    Compass,
    Newspaper,
    Calendar,
    School,
    Sparkles,
    Mail,
} from 'lucide-react';

const PRIMARY_ITEMS = [
    { path: '/about', matchPaths: ['/about', '/tentang'], label: 'Tentang', icon: Users },
    { path: '/programs', matchPaths: ['/programs', '/program'], label: 'Program', icon: Compass },
    { path: '/berita', matchPaths: ['/berita'], label: 'Berita', icon: Newspaper },
    { path: '/events', matchPaths: ['/events', '/agenda'], label: 'Agenda', icon: Calendar },
    { path: '/schools', matchPaths: ['/schools', '/sekolah'], label: 'Sekolah', icon: School },
];

const SERVICE_ITEMS = [
    {
        path: '/articles',
        matchPaths: ['/articles', '/artikel'],
        label: 'Artikel Dakwah',
        desc: 'Tulisan singkat seputar iman, adab, belajar, dan kepemimpinan pelajar.',
        icon: BookOpen,
    },
    {
        path: '/gallery',
        matchPaths: ['/gallery', '/galeri'],
        label: 'Galeri Dokumentasi',
        desc: 'Arsip visual kegiatan kebersamaan, kajian, musyawarah, dan kaderisasi.',
        icon: Image,
    },
    {
        path: '/contact',
        matchPaths: ['/contact', '/kontak'],
        label: 'Kontak & Aspirasi',
        desc: 'Jalur komunikasi resmi untuk kolaborasi sekolah dan pengajuan kegiatan.',
        icon: Phone,
    },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 14);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setServicesOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        const handleOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setServicesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const isPathActive = (paths = []) =>
        paths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`));

    const isServiceActive = SERVICE_ITEMS.some((item) => isPathActive(item.matchPaths));

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
                            const active = isPathActive(item.matchPaths);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`rk-nav-link ${active ? 'is-active' : ''}`}
                                >
                                    <Icon size={15} className="rk-nav-link-icon" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}

                        <div className="rk-nav-dropdown-wrap" ref={dropdownRef}>
                            <button
                                type="button"
                                className={`rk-nav-link rk-nav-dropdown-trigger ${
                                    isServiceActive || servicesOpen ? 'is-active' : ''
                                }`}
                                onClick={() => setServicesOpen((prev) => !prev)}
                                aria-expanded={servicesOpen}
                            >
                                <Sparkles size={15} className="rk-nav-link-icon" />
                                <span>Layanan</span>
                                <ChevronDown
                                    size={15}
                                    style={{
                                        transition: 'transform 200ms ease',
                                        transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                />
                            </button>

                            {servicesOpen && (
                                <div className="rk-nav-dropdown" role="menu">
                                    <div className="rk-nav-dropdown-head">
                                        <span>Ruang Belajar & Layanan Pelajar</span>
                                        <small>Akses cepat fitur komunitas ROKABA</small>
                                    </div>
                                    <div className="rk-nav-dropdown-grid">
                                        {SERVICE_ITEMS.map((item) => {
                                            const Icon = item.icon;
                                            const active = isPathActive(item.matchPaths);
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    className={`rk-nav-dropdown-item ${active ? 'is-active' : ''}`}
                                                    role="menuitem"
                                                >
                                                    <span className="rk-nav-dropdown-icon">
                                                        <Icon size={18} />
                                                    </span>
                                                    <span className="rk-nav-dropdown-copy">
                                                        <strong>
                                                            {item.label}
                                                            <ArrowUpRight size={14} />
                                                        </strong>
                                                        <small>{item.desc}</small>
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
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
                                <Link
                                    to="/"
                                    className={`rk-mobile-link ${location.pathname === '/' ? 'is-active' : ''}`}
                                >
                                    Beranda
                                </Link>
                                {PRIMARY_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`rk-mobile-link ${
                                                isPathActive(item.matchPaths) ? 'is-active' : ''
                                            }`}
                                        >
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                                <Icon size={16} />
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rk-mobile-section">
                            <span className="rk-mobile-eyebrow">Layanan & Ruang Belajar</span>
                            <div className="rk-mobile-service-grid">
                                {SERVICE_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    const active = isPathActive(item.matchPaths);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`rk-mobile-service-card ${active ? 'is-active' : ''}`}
                                        >
                                            <span className="rk-nav-dropdown-icon">
                                                <Icon size={17} />
                                            </span>
                                            <div>
                                                <strong>{item.label}</strong>
                                                <small>{item.desc}</small>
                                            </div>
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
