import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Share2, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  Container,
  SoftCard,
  EmptyState,
  formatIndonesianDate,
} from '../components/ui/SoftUI';

function cleanMarkdownFormatting(text = '') {
  return String(text).replace(/\*\*(.*?)\*\*/g, '$1').trim();
}

function parseArticleSections(article) {
  const raw = String(article?.content || '').trim();
  const blocks = raw
    .split(/\n\s*\n|\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = {
    id: 'pengantar',
    heading: 'Pengantar',
    paragraphs: [],
  };

  blocks.forEach((block) => {
    const numberedMatch = block.match(/^(\d+)\.\s+\*\*([^*]+)\*\*\s*(?:[—:-]\s*(.*))?$/);
    const simpleNumberedMatch = block.match(/^(\d+)\.\s+([^:—-]+)(?:[:—-]\s*(.*))?$/);
    const mdHeadingMatch = block.match(/^#{2,3}\s+(.*)$/);

    if (numberedMatch) {
      if (currentSection.paragraphs.length > 0 || currentSection.id !== 'pengantar') {
        sections.push(currentSection);
      }
      const headingText = cleanMarkdownFormatting(numberedMatch[2]);
      const restText = cleanMarkdownFormatting(numberedMatch[3] || '');
      currentSection = {
        id: `bagian-${sections.length + 1}`,
        heading: headingText,
        paragraphs: restText ? [restText] : [],
      };
    } else if (simpleNumberedMatch) {
      if (currentSection.paragraphs.length > 0 || currentSection.id !== 'pengantar') {
        sections.push(currentSection);
      }
      const headingText = cleanMarkdownFormatting(simpleNumberedMatch[2]);
      const restText = cleanMarkdownFormatting(simpleNumberedMatch[3] || '');
      currentSection = {
        id: `bagian-${sections.length + 1}`,
        heading: headingText,
        paragraphs: restText ? [restText] : [],
      };
    } else if (mdHeadingMatch) {
      if (currentSection.paragraphs.length > 0 || currentSection.id !== 'pengantar') {
        sections.push(currentSection);
      }
      currentSection = {
        id: `bagian-${sections.length + 1}`,
        heading: cleanMarkdownFormatting(mdHeadingMatch[1]),
        paragraphs: [],
      };
    } else {
      currentSection.paragraphs.push(cleanMarkdownFormatting(block));
    }
  });

  if (currentSection.paragraphs.length > 0 || sections.length === 0) {
    sections.push(currentSection);
  }

  if (sections.length === 1 && sections[0].paragraphs.length >= 2) {
    const paras = sections[0].paragraphs;
    return [
      {
        id: 'bagian-1',
        heading: 'Pengantar & Konteks',
        paragraphs: [paras[0]],
      },
      {
        id: 'bagian-2',
        heading: 'Intisari Pembahasan',
        paragraphs: paras.slice(1, Math.max(2, paras.length - 1)),
      },
      ...(paras.length > 2
        ? [
            {
              id: 'bagian-3',
              heading: 'Refleksi Penutup',
              paragraphs: [paras[paras.length - 1]],
            },
          ]
        : []),
    ];
  }

  return sections;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { articles = [] } = useData();
  const [copied, setCopied] = useState(false);

  const article = articles.find(
    (a) => String(a.slug) === String(slug) || String(a.id) === String(slug)
  );

  const sections = useMemo(
    () => (article ? parseArticleSections(article) : []),
    [article]
  );

  if (!article) {
    return (
      <div className="rk-page">
        <section className="rk-section">
          <Container>
            <EmptyState
              asPageHeading
              title="Artikel tidak ditemukan"
              description="Bacaan yang Anda cari tidak tersedia atau tautannya telah berubah."
              action={
                <Link to="/articles" className="rk-btn-primary">
                  Kembali ke Daftar Artikel
                </Link>
              }
            />
          </Container>
        </section>
      </div>
    );
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: shareUrl,
        });
        return;
      } catch {
        // Lanjut ke clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rk-page">
      <section className="rk-page-header">
        <Container>
          <nav className="rk-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link to="/articles">Artikel</Link>
          </nav>

          <div className="rk-meta-line" style={{ marginBottom: '10px' }}>
            <span className="rk-badge rk-badge--brass">
              {article.category || 'Kepemimpinan'}
            </span>
            <span>•</span>
            <span>{article.readingTime || '5 menit'} baca</span>
          </div>

          <h1
            className="rk-page-title"
            style={{ maxWidth: '24ch', marginBottom: '12px' }}
          >
            {article.title}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--rk-muted)', margin: 0 }}>
              Ditulis oleh{' '}
              <strong style={{ color: 'var(--rk-ink)' }}>
                {article.author || 'Tim Literasi ROKABA'}
              </strong>{' '}
              • {formatIndonesianDate(article.date)}
            </p>

            <button
              type="button"
              className="rk-pill"
              onClick={handleShare}
              aria-label="Bagikan artikel"
            >
              {copied ? <Check size={15} /> : <Share2 size={15} />}
              <span>{copied ? 'Tautan disalin' : 'Bagikan bacaan'}</span>
            </button>
          </div>
        </Container>
      </section>

      <section className="rk-section">
        <Container>
          <div className="rk-article-layout">
            {/* Kolom Baca Utama */}
            <SoftCard
              as="article"
              style={{ padding: 'clamp(24px, 3.8vw, 40px)' }}
            >
              <div className="rk-prose">
                {article.excerpt && (
                  <p className="rk-lead-paragraph">{article.excerpt}</p>
                )}

                <blockquote className="rk-quote-callout">
                  “Keteladanan dan keikhlasan dalam belajar adalah fondasi terkuat bagi setiap kader ROHIS dalam menebar manfaat di lingkungan sekolah.”
                </blockquote>

                {sections.map((sec, idx) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    style={{ scrollMarginTop: '110px', marginTop: idx === 0 ? '18px' : '28px' }}
                  >
                    {sec.heading && (
                      <h2>
                        {idx + 1}. {sec.heading}
                      </h2>
                    )}
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </section>
                ))}
              </div>
            </SoftCard>

            {/* Kolom Kanan: Daftar Isi & Artikel Terkait */}
            <aside className="rk-toc-card" aria-label="Daftar isi artikel">
              <div style={{ display: 'grid', gap: '18px' }}>
                <SoftCard>
                  <h2
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      marginBottom: '12px',
                      color: 'var(--rk-ink)',
                    }}
                  >
                    Daftar isi
                  </h2>
                  <ol className="rk-toc-list">
                    {sections.map((sec) => (
                      <li key={sec.id}>
                        <a href={`#${sec.id}`}>{sec.heading}</a>
                      </li>
                    ))}
                  </ol>
                </SoftCard>

                {relatedArticles.length > 0 && (
                  <SoftCard>
                    <h2
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        marginBottom: '10px',
                        color: 'var(--rk-ink)',
                      }}
                    >
                      Artikel terkait
                    </h2>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {relatedArticles.map((rel) => (
                        <div
                          key={rel.id}
                          style={{
                            paddingTop: '10px',
                            borderTop: '1px solid var(--rk-line)',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--rk-brass-text)',
                            }}
                          >
                            {rel.category || 'Bacaan'}
                          </span>
                          <h3 style={{ fontSize: '0.92rem', marginTop: '4px' }}>
                            <Link
                              to={`/articles/${rel.slug || rel.id}`}
                              style={{ color: 'var(--rk-ink)' }}
                            >
                              {rel.title}
                            </Link>
                          </h3>
                        </div>
                      ))}
                    </div>
                  </SoftCard>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
