import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    Calendar,
    User,
    Share2,
    Check,
    ArrowRight,
    Quote,
    MessageCircle,
    Send,
    Link2,
} from 'lucide-react';
import { fetchCmsData, getDriveImageUrl } from '../services/cmsService';
import { DEFAULT_ARTICLES } from './Articles';
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

export default function ArticleDetail() {
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

    const articles = useMemo(() => {
        const raw =
            Array.isArray(cms?.articles) && cms.articles.length > 0
                ? cms.articles
                : DEFAULT_ARTICLES;
        return raw.map((item, idx) => {
            const fallback = DEFAULT_ARTICLES[idx % DEFAULT_ARTICLES.length];
            const rawBody = item.content || item.body || fallback.content;
            const paragraphs = Array.isArray(rawBody)
                ? rawBody
                : typeof rawBody === 'string' && rawBody.trim()
                ? rawBody.split(/\n\n+/)
                : fallback.content;
            return {
                id: item.id || fallback.id || `art-${idx}`,
                slug: item.slug || fallback.slug || `artikel-${idx + 1}`,
                title: item.title || fallback.title,
                category: item.category || fallback.category || 'Motivasi',
                readTime: item.readTime || fallback.readTime || '4 menit baca',
                date: item.date || fallback.date,
                author: item.author || fallback.author || 'Tim Literasi ROKABA',
                image: resolvePhotoUrl(item.image || item.photo, fallback.image),
                excerpt:
                    item.excerpt ||
                    item.summary ||
                    item.description ||
                    fallback.excerpt,
                takeaways: item.takeaways || fallback.takeaways || [],
                quote:
                    item.quote ||
                    fallback.quote ||
                    'Belajar yang tertib dan organisasi yang sehat akan saling menguatkan.',
                paragraphs,
            };
        });
    }, [cms]);

    const article = useMemo(() => {
        return (
            articles.find(
                (a) => a.slug === slug || String(a.id) === String(slug)
            ) || articles[0]
        );
    }, [articles, slug]);

    const otherArticles = useMemo(() => {
        return articles.filter((a) => a.slug !== article?.slug).slice(0, 2);
    }, [articles, article]);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    };

    const shareUrl =
        typeof window !== 'undefined'
            ? encodeURIComponent(window.location.href)
            : '';
    const shareTitle = encodeURIComponent(article?.title || 'Artikel ROKABA');

    if (!article) return null;

    return (
        <div className="rk-page">
            <article className="rk-detail-section">
                <div className="rk-container">
                    <div className="rk-detail-header">
                        <div className="rk-article-top-bar">
                            <Link to="/articles" className="rk-back-link">
                                <ArrowLeft size={16} />
                                <span>Artikel</span>
                            </Link>
                            <GlassChip>{article.category}</GlassChip>
                        </div>

                        <h1 className="rk-detail-title" style={{ marginTop: 14 }}>
                            {article.title}
                        </h1>

                        <div className="rk-detail-meta">
                            <span>
                                <Calendar size={15} />
                                {article.date}
                            </span>
                            <span>
                                <Clock size={15} />
                                {article.readTime}
                            </span>
                            <span>
                                <User size={15} />
                                {article.author}
                            </span>
                        </div>

                        <SoftCard
                            className="rk-detail-body-card rk-article-reading-card-v3"
                            style={{ marginTop: 24 }}
                        >
                            {/* BAGIAN ATAS: TEKS PENGANTAR + FOTO INLINE DI KANAN (PAPAN 08-ARTIKEL-PC) */}
                            <div className="rk-article-detail-top-split">
                                <div className="rk-article-detail-intro-col">
                                    <p className="rk-detail-lead rk-detail-lead--accent">
                                        {article.excerpt}
                                    </p>
                                    <p className="rk-body-text" style={{ marginTop: 14 }}>
                                        {article.paragraphs[0]}
                                    </p>
                                </div>

                                <div className="rk-article-detail-photo-col">
                                    <FramedPhoto
                                        src={article.image}
                                        alt={article.title}
                                        captionTitle="Literasi & kajian pelajar"
                                        captionSub="ROHIS Kabupaten Banyumas"
                                        aspectRatio="16 / 10.5"
                                    />
                                </div>
                            </div>

                            {/* POIN PEGANGAN BERNOMOR */}
                            {article.takeaways && article.takeaways.length > 0 && (
                                <div className="rk-article-takeaways-box">
                                    <h2 className="rk-detail-subheading">
                                        Tiga pegangan sederhana
                                    </h2>
                                    <ol className="rk-numbered-takeaways">
                                        {article.takeaways.map((point, idx) => (
                                            <li key={idx}>
                                                <span className="rk-takeaway-num">
                                                    {idx + 1}
                                                </span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* PARAGRAF LANJUTAN */}
                            <div className="rk-detail-prose" style={{ marginTop: 18 }}>
                                {article.paragraphs.slice(1).map((p, idx) => (
                                    <p key={idx}>{p}</p>
                                ))}
                            </div>

                            {/* KUTIPAN */}
                            <div className="rk-quote-callout">
                                <Quote size={20} className="rk-quote-callout-icon" />
                                <blockquote>“{article.quote}”</blockquote>
                            </div>

                            {/* BAGIKAN ARTIKEL */}
                            <div className="rk-detail-footer-bar">
                                <Link to="/articles" className="rk-btn-secondary">
                                    <ArrowLeft size={16} />
                                    <span>Daftar artikel</span>
                                </Link>

                                <div className="rk-article-share-bar">
                                    <span className="rk-article-share-label">
                                        Bagikan artikel:
                                    </span>
                                    <a
                                        href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rk-share-pill"
                                    >
                                        <MessageCircle size={14} />
                                        <span>WhatsApp</span>
                                    </a>
                                    <a
                                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rk-share-pill"
                                    >
                                        <Send size={14} />
                                        <span>Telegram</span>
                                    </a>
                                    <button
                                        type="button"
                                        className="rk-share-pill"
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <Check size={14} />
                                        ) : (
                                            <Link2 size={14} />
                                        )}
                                        <span>
                                            {copied ? 'Tersalin' : 'Salin tautan'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </SoftCard>
                    </div>

                    {otherArticles.length > 0 && (
                        <div className="rk-related-block">
                            <h2
                                className="rk-section-title"
                                style={{ fontSize: '1.5rem', marginBottom: 18 }}
                            >
                                Baca juga tulisan lainnya
                            </h2>
                            <div className="rk-articles-grid-v3">
                                {otherArticles.map((art) => (
                                    <SoftCard
                                        key={art.id}
                                        as="article"
                                        className="rk-article-card-v3"
                                    >
                                        <Link
                                            to={`/articles/${art.slug}`}
                                            className="rk-article-card-thumb"
                                        >
                                            <img
                                                src={art.image}
                                                alt={art.title}
                                                loading="lazy"
                                            />
                                        </Link>
                                        <div className="rk-article-card-body-v3">
                                            <div className="rk-article-meta-row">
                                                <GlassChip>{art.category}</GlassChip>
                                                <span>{art.readTime}</span>
                                            </div>
                                            <h3>
                                                <Link to={`/articles/${art.slug}`}>
                                                    {art.title}
                                                </Link>
                                            </h3>
                                            <p>{art.excerpt}</p>
                                            <div className="rk-article-card-footer-v3">
                                                <span className="rk-news-card-author">
                                                    {art.date}
                                                </span>
                                                <Link
                                                    to={`/articles/${art.slug}`}
                                                    className="rk-article-arrow-btn"
                                                >
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </SoftCard>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
