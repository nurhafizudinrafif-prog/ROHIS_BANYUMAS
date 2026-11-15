import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    MapPin,
    Share2,
    Check,
    ArrowRight,
    Tag,
    Quote,
    Link2,
    MessageCircle,
    Send,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import { DEFAULT_NEWS } from './News';
import {
    Eyebrow,
    FramedPhoto,
    GlassChip,
    SoftCard,
} from '../components/ui/SoftUI';

function resolvePhotoUrl(raw, fallback) {
    if (!raw) return fallback;
    if (raw.startsWith('http') || raw.startsWith('/')) return raw;
    return getDriveImageUrl(raw);
}

export default function NewsDetail() {
    const { slug } = useParams();
    const [cms, setCms] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetchCmsData().then((data) => {
            if (mounted && data) setCms(data);
        });
        return () => {
            mounted = false;
        };
    }, []);

    const allNews = useMemo(() => {
        const rawList =
            Array.isArray(cms?.newsList) && cms.newsList.length > 0
                ? cms.newsList
                : DEFAULT_NEWS;
        return rawList.map((item, idx) => {
            const fallback = DEFAULT_NEWS[idx % DEFAULT_NEWS.length];
            const rawBody = item.content || item.body || fallback.content;
            const paragraphs = Array.isArray(rawBody)
                ? rawBody
                : typeof rawBody === 'string' && rawBody.trim()
                ? rawBody.split(/\n\n+/)
                : fallback.content;
            return {
                id: item.id || fallback.id || `news-${idx}`,
                slug: item.slug || fallback.slug || `berita-${idx + 1}`,
                title: item.title || fallback.title,
                category: item.category || fallback.category || 'Organisasi',
                date: item.date || fallback.date,
                author: item.author || fallback.author || 'Jurnalistik ROKABA',
                location: item.location || fallback.location || 'Kabupaten Banyumas',
                image: resolvePhotoUrl(item.image || item.photo, fallback.image),
                summary:
                    item.summary ||
                    item.excerpt ||
                    item.description ||
                    fallback.summary,
                paragraphs,
            };
        });
    }, [cms]);

    const article = useMemo(() => {
        return (
            allNews.find(
                (n) =>
                    n.slug === slug ||
                    String(n.id) === String(slug)
            ) || allNews[0]
        );
    }, [allNews, slug]);

    const relatedNews = useMemo(() => {
        return allNews.filter((n) => n.slug !== article?.slug).slice(0, 2);
    }, [allNews, article]);

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    };

    const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
    const shareTitle = encodeURIComponent(article?.title || 'Berita ROKABA');

    if (!article) return null;

    return (
        <div className="rk-page">
            <article className="rk-detail-section">
                <div className="rk-container">
                    {/* BREADCRUMB & HEADER */}
                    <div className="rk-detail-header rk-detail-header--wide">
                        <nav className="rk-breadcrumb" aria-label="Breadcrumb">
                            <Link to="/">Beranda</Link>
                            <span>/</span>
                            <Link to="/berita">Berita</Link>
                            <span>/</span>
                            <strong>{article.category}</strong>
                        </nav>

                        <h1 className="rk-detail-title" style={{ marginTop: 14 }}>
                            {article.title}
                        </h1>

                        <div className="rk-detail-meta">
                            <span>
                                <Calendar size={15} />
                                {article.date}
                            </span>
                            <span>
                                <User size={15} />
                                {article.author}
                            </span>
                            <span>
                                <Tag size={15} />
                                {article.category}
                            </span>
                            {article.location && (
                                <span>
                                    <MapPin size={15} />
                                    {article.location}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 2-COLUMN LAYOUT (PAPAN 07-DETAIL-BERITA-PC) */}
                    <div className="rk-news-detail-layout">
                        {/* KOLOM BACA UTAMA */}
                        <div className="rk-news-detail-main">
                            <FramedPhoto
                                src={article.image}
                                alt={article.title}
                                captionTitle={`Dokumentasi ${article.category.toLowerCase()} kader ROKABA`}
                                captionSub={article.location}
                                aspectRatio="16 / 9.8"
                            />

                            <SoftCard className="rk-detail-body-card" style={{ marginTop: 22 }}>
                                <p className="rk-detail-lead rk-detail-lead--accent">
                                    {article.summary}
                                </p>

                                <h2 className="rk-detail-subheading">
                                    Sinergi program lintas sekolah
                                </h2>

                                <div className="rk-detail-prose">
                                    {article.paragraphs.map((p, idx) => (
                                        <p key={idx}>{p}</p>
                                    ))}
                                </div>

                                <div className="rk-quote-callout">
                                    <Quote size={22} className="rk-quote-callout-icon" />
                                    <blockquote>
                                        “Ukhuwah yang terjaga menjadi fondasi lahirnya
                                        program-program kebaikan yang relevan bagi pelajar.”
                                    </blockquote>
                                </div>

                                <div className="rk-detail-footer-bar">
                                    <Link to="/berita" className="rk-btn-secondary">
                                        <ArrowLeft size={16} />
                                        <span>Kembali ke berita</span>
                                    </Link>
                                </div>
                            </SoftCard>
                        </div>

                        {/* SIDEBAR KANAN: BAGIKAN & BERITA TERKAIT */}
                        <aside className="rk-news-detail-sidebar">
                            <SoftCard className="rk-sidebar-card">
                                <h3>Bagikan</h3>
                                <div className="rk-share-grid">
                                    <a
                                        href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rk-share-pill"
                                    >
                                        <MessageCircle size={15} />
                                        <span>WhatsApp</span>
                                    </a>
                                    <a
                                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rk-share-pill"
                                    >
                                        <Send size={15} />
                                        <span>Telegram</span>
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rk-share-pill"
                                    >
                                        <Share2 size={15} />
                                        <span>Facebook</span>
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rk-share-pill"
                                    >
                                        <Share2 size={15} />
                                        <span>X</span>
                                    </a>
                                </div>

                                <button
                                    type="button"
                                    className="rk-copy-link-btn"
                                    onClick={handleCopyLink}
                                >
                                    {copied ? <Check size={15} /> : <Link2 size={15} />}
                                    <span>{copied ? 'Tautan tersalin!' : 'Salin tautan'}</span>
                                </button>
                            </SoftCard>

                            <SoftCard className="rk-sidebar-card">
                                <h3>Berita Terkait</h3>
                                <div className="rk-related-sidebar-list">
                                    {relatedNews.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/berita/${item.slug}`}
                                            className="rk-related-sidebar-item"
                                        >
                                            <div className="rk-related-sidebar-thumb">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="rk-related-sidebar-copy">
                                                <strong>{item.title}</strong>
                                                <small>{item.date}</small>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </SoftCard>
                        </aside>
                    </div>
                </div>
            </article>
        </div>
    );
}
