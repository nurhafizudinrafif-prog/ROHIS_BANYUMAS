import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  extractDriveId,
  getDriveFallbackThumbnailUrl,
  getDriveTertiaryThumbnailUrl,
  getDriveThumbnailUrl,
  parseImageUrl,
} from '@shared/services/mediaHelper.js';
import logo from '../../assets/logo.png';

/**
 * Authentic ROKABA Documentation Photo IDs (Google Drive)
 */
export const ROKABA_REAL_PHOTOS = [
  'https://drive.google.com/file/d/1PUOOkf_OLutx7LItdz6_7U7cNRtd1XrB/view?usp=sharing',
  'https://drive.google.com/file/d/1FSPbsFV9dStzLQsxXRi3VdOj_FfE-BKJ/view?usp=sharing',
  'https://drive.google.com/file/d/1D26IYfzW_4GuBuTxbiELEyPbE8z6CGoV/view?usp=sharing',
  'https://drive.google.com/file/d/12Hg2mUTC7wH-Tse3oAjONPAyRljJ87CJ/view?usp=sharing',
  'https://drive.google.com/file/d/1HdH8cv2QHiUo8UByGHFFm3ASIDh5-2JU/view?usp=sharing',
];

/**
 * Normalizes `team` data whether stored as `{ bph, divisions }` object or flat array
 */
export function normalizeTeamData(team) {
  if (!team) {
    return { bph: [], divisions: [], allMembers: [] };
  }

  if (Array.isArray(team)) {
    const bphRoles = [
      'Dewan Pembina',
      'Ketua Umum',
      'Ketua Ikhwan',
      'Ketua Akhwat',
      'Wakil Ketua',
      'Sekretaris',
      'Sekretaris 1',
      'Sekretaris 2',
      'Bendahara',
      'Bendahara 1',
      'Bendahara 2',
      'Bendahara 3',
      'BPH / Kebendaharaan',
    ];
    const bph = team.filter(
      (m) => bphRoles.includes(m.role) || m.division === 'BPH'
    );
    return { bph, divisions: [], allMembers: team };
  }

  const bph = Array.isArray(team.bph) ? team.bph : [];
  const divisions = Array.isArray(team.divisions) ? team.divisions : [];
  const divisionMembers = divisions.flatMap((div) =>
    (Array.isArray(div.members) ? div.members : []).map((m) => ({
      ...m,
      division: m.division || div.name,
      shortDivision: div.shortName || div.name,
    }))
  );

  const allMembers = [
    ...bph.map((m) => ({
      ...m,
      division: m.division || 'BPH',
      shortDivision: 'BPH',
    })),
    ...divisionMembers,
  ];

  return { bph, divisions, allMembers };
}

/**
 * Returns today's date string (YYYY-MM-DD) in Asia/Jakarta timezone
 */
export function getJakartaToday() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Checks if an event is genuinely upcoming in Asia/Jakarta time
 */
export function isEventUpcoming(event, todayStr = getJakartaToday()) {
  if (!event || event.status === 'cancelled' || event.status === 'completed') {
    return false;
  }
  const rawDate = typeof event.date === 'string' ? event.date.trim().slice(0, 10) : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return false;
  }
  return rawDate >= todayStr;
}

const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const MONTHS_SHORT_ID = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MEI',
  'JUN',
  'JUL',
  'AGU',
  'SEP',
  'OKT',
  'NOV',
  'DES',
];

/**
 * Formats an ISO/date string into readable Indonesian date
 */
export function formatIndonesianDate(value) {
  if (!value) return '';
  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = match[1];
    const monthIdx = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${MONTHS_ID[monthIdx]} ${year}`;
    }
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }
  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a date string into short day + 3-letter uppercase Indonesian month for Event date boxes
 */
export function formatShortDayMonth(dateStr) {
  if (!dateStr) return { day: '--', month: '---' };
  const match = String(dateStr).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return { day: '--', month: '---' };
  const monthIdx = parseInt(match[2], 10) - 1;
  const day = match[3];
  return {
    day,
    month: MONTHS_SHORT_ID[monthIdx] || '---',
  };
}

/**
 * SmartImage — Multi-tier Google Drive & local image renderer with graceful ROKABA fallback
 */
export function SmartImage({
  src,
  alt = 'Dokumentasi ROHIS Kabupaten Banyumas',
  eager = false,
  className = '',
  style,
}) {
  const [tier, setTier] = useState(0);

  // Replace generic stock unsplash URLs with real ROKABA documentation photos
  const normalizedSrc =
    typeof src === 'string' && src.includes('unsplash.com')
      ? ROKABA_REAL_PHOTOS[0]
      : src;

  const driveId = extractDriveId(normalizedSrc);
  const candidates = driveId
    ? [
        getDriveFallbackThumbnailUrl(driveId, 1400),
        getDriveThumbnailUrl(driveId, 1400),
        getDriveTertiaryThumbnailUrl(driveId),
      ]
    : [parseImageUrl(normalizedSrc)].filter(Boolean);

  const activeUrl = candidates[tier] || '';

  useEffect(() => {
    setTier(0);
  }, [normalizedSrc]);

  if (!activeUrl) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'var(--rk-surface-inset)',
          color: 'var(--rk-muted)',
          padding: '20px',
          textAlign: 'center',
          ...style,
        }}
      >
        <img
          src={logo}
          alt=""
          style={{ width: '44px', height: '44px', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
          ROHIS Kabupaten Banyumas
        </span>
      </div>
    );
  }

  return (
    <img
      src={activeUrl}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      className={className}
      style={style}
      onError={() => {
        if (tier + 1 < candidates.length) {
          setTier((prev) => prev + 1);
        } else {
          setTier(99);
        }
      }}
    />
  );
}

/**
 * Container — Standard 1240px responsive layout container
 */
export function Container({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`rk-container ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

/**
 * GlassNav — Liquid Glass Navigation Surface
 */
export function GlassNav({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`rk-glass-nav ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

/**
 * PageHeader — Consistent page header with breadcrumb, optional brass eyebrow, single h1, and lead text
 */
export function PageHeader({
  breadcrumb,
  breadcrumbs,
  eyebrow,
  title,
  lead,
  actions,
  className = '',
}) {
  const crumbs = breadcrumb || breadcrumbs || [];

  return (
    <section className={`rk-page-header ${className}`.trim()}>
      <Container>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="rk-breadcrumb">
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <span
                  key={`${crumb.label}-${idx}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to}>{crumb.label}</Link>
                  ) : (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      style={{
                        color: isLast ? 'var(--rk-ink)' : undefined,
                        fontWeight: isLast ? 600 : undefined,
                      }}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span aria-hidden="true">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        {eyebrow && (
          <div className="rk-eyebrow">
            <span className="rk-eyebrow-bar" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 className="rk-page-title">{title}</h1>
            {lead && <p className="rk-page-lead">{lead}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </Container>
    </section>
  );
}

/**
 * SoftCard — Soft UI raised card or recessed inset panel
 */
export function SoftCard({
  as: Component = 'div',
  variant = 'raised',
  interactive = false,
  selected = false,
  className = '',
  children,
  ...props
}) {
  const baseClass = variant === 'inset' ? 'rk-inset-panel' : 'rk-soft-card';
  const interactiveClass = interactive ? 'rk-soft-card--interactive' : '';
  const selectedClass = selected ? 'rk-soft-card--selected' : '';

  return (
    <Component
      className={`${baseClass} ${interactiveClass} ${selectedClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * PrimaryButton — Pine bevel primary button or soft raised secondary button
 */
export function PrimaryButton({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const btnClass = variant === 'secondary' ? 'rk-btn-secondary' : 'rk-btn-primary';
  return (
    <Component className={`${btnClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

/**
 * InsetField — Recessed Soft UI input, select, or textarea with visible label
 */
export function InsetField({
  id,
  label,
  as = 'input',
  className = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const Tag = as;

  return (
    <div className={`rk-field-group ${className}`.trim()}>
      {label && (
        <label htmlFor={fieldId} className="rk-field-label">
          {label}
        </label>
      )}
      <Tag id={fieldId} className="rk-inset-control" {...props}>
        {children}
      </Tag>
    </div>
  );
}

/**
 * FilterBar — Unified filter bar with Soft UI category pills and inset search slot
 */
export function FilterBar({
  categories = [],
  activeCategory,
  onSelectCategory,
  searchNode,
  rightNode,
  className = '',
}) {
  return (
    <div className={`rk-filter-bar ${className}`.trim()}>
      {categories.length > 0 && (
        <div className="rk-filter-pills" role="group" aria-label="Filter kategori">
          {categories.map((cat) => {
            const value = typeof cat === 'object' ? cat.value : cat;
            const label = typeof cat === 'object' ? cat.label : cat;
            const isActive = activeCategory === value;
            return (
              <button
                key={value}
                type="button"
                className="rk-pill"
                aria-pressed={isActive}
                onClick={() => onSelectCategory(value)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
      {searchNode && <div className="rk-filter-search">{searchNode}</div>}
      {rightNode && <div>{rightNode}</div>}
    </div>
  );
}

/**
 * EmptyState — Informative Soft UI empty / zero-result state
 */
export function EmptyState({ title, description, action, asPageHeading = false }) {
  const HeadingTag = asPageHeading ? 'h1' : 'h3';
  return (
    <div className="rk-empty-state" role="status">
      <HeadingTag style={asPageHeading ? { fontSize: '1.5rem', marginBottom: '8px' } : undefined}>
        {title}
      </HeadingTag>
      {description && (
        <p style={{ maxWidth: '48ch', margin: '0 auto 16px' }}>{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * DocumentRow — Soft UI row for Library documents
 */
export function DocumentRow({
  badge = 'PDF',
  title,
  meta,
  actionLabel = 'Lihat dokumen',
  onAction,
  href,
}) {
  return (
    <SoftCard as="article" interactive className="rk-document-row">
      <div className="rk-document-info">
        <span className="rk-doc-badge">{badge}</span>
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '2px' }}>{title}</h3>
          {meta && <p style={{ fontSize: '0.86rem' }}>{meta}</p>}
        </div>
      </div>

      <div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rk-card-link"
            style={{ marginTop: 0 }}
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="rk-card-link"
            style={{
              marginTop: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </SoftCard>
  );
}

/**
 * PhotoFrame — Recessed Soft UI photo container with multi-tier Google Drive fallback & Liquid Glass caption
 */
export function PhotoFrame({
  src,
  alt = 'Dokumentasi ROHIS Kabupaten Banyumas',
  aspect = '16/10',
  captionTitle,
  captionSub,
  eager = false,
  className = '',
  children,
}) {
  return (
    <div className={`rk-photo-frame ${className}`.trim()}>
      <div className="rk-photo-inner" style={{ aspectRatio: aspect }}>
        <SmartImage src={src} alt={alt} eager={eager} />

        {(captionTitle || captionSub) && (
          <div className="rk-glass-caption">
            {captionTitle && <strong>{captionTitle}</strong>}
            {captionSub && <span>{captionSub}</span>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

/**
 * AccessibleDialog — Modal dialog with Escape key, focus trap, and focus restoration
 */
export function AccessibleDialog({
  open,
  onClose,
  title,
  eyebrow,
  subtitle,
  children,
}) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const titleId = useId();
  const eyebrowText = eyebrow || subtitle || '';

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="rk-dialog-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        className="rk-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="rk-dialog-head">
          <div>
            {eyebrowText && (
              <div className="rk-eyebrow" style={{ marginBottom: '4px' }}>
                <span className="rk-eyebrow-bar" aria-hidden="true" />
                <span>{eyebrowText}</span>
              </div>
            )}
            <h2 id={titleId} style={{ fontSize: '1.25rem' }}>
              {title}
            </h2>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="rk-dialog-close"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginTop: '14px' }}>{children}</div>
      </div>
    </div>
  );
}
