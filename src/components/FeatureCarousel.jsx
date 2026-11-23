import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Clock3,
    MapPin,
    UserRound,
} from 'lucide-react';
import {
    AccessibleDialog,
    Eyebrow,
    PhotoFrame,
    ROKABA_REAL_PHOTOS,
    formatIndonesianDate,
} from './ui/SoftUI';

const FALLBACK_NEWS = [
    {
        id: 'news-1',
        slug: 'muskerda-rokaba-2026',
        title: 'Musyawarah & Rapat Kerja Pengurus ROHIS Kabupaten Banyumas',
        category: 'Organisasi',
        date: '12 Januari 2026',
        author: 'Jurnalistik ROKABA',
        image: '/documentation/02-muskerda.jpg',
        excerpt:
            'Penyelarasan arah gerak lima divisi dan penguatan koordinasi 17 ROHIS sekolah anggota untuk periode kepengurusan berjalan.',
    },
    {
        id: 'news-2',
        slug: 'kajian-pelajar-lintas-sekolah',
        title: 'Kajian Pelajar & Halaqah Kebersamaan Lintas Sekolah Banyumas',
        category: 'Kajian',
        date: '26 Januari 2026',
        author: 'Divisi Dakwah',
        image: '/documentation/03-kajian.jpg',
        excerpt:
            'Menghadirkan ruang belajar keislaman yang sejuk, dialogis, dan menguatkan adab keseharian pelajar putih abu-abu.',
    },
    {
        id: 'news-3',
        slug: 'silaturahmi-akbar-kader-rokaba',
        title: 'Silaturahmi & Kebersamaan Kader ROHIS se-Kabupaten Banyumas',
        category: 'Sosial',
        date: '9 Februari 2026',
        author: 'Divisi Humas',
        image: '/documentation/01-kebersamaan.jpg',
        excerpt:
            'Mempererat persaudaraan antar-pengurus ROHIS sekolah melalui temu kader, diskusi jejaring, dan kolaborasi program.',
    },
];

const FALLBACK_EVENTS = [
    {
        id: 'evt-1',
        title: 'Kajian Pelajar & Silaturahmi ROHIS',
        category: 'Kajian',
        date: '18 Januari 2026',
        time: '08.30 – 11.30 WIB',
        location: 'Masjid Agung / Sekolah Anggota',
        image: '/documentation/03-kajian.jpg',
        description:
            'Kajian rutin dan temu pelajar lintas SMA, SMK, dan MA se-Kabupaten Banyumas untuk menguatkan ilmu, adab, dan persaudaraan.',
    },
    {
        id: 'evt-2',
        title: 'Musyawarah & Koordinasi Pengurus',
        category: 'Organisasi',
        date: '2 Februari 2026',
        time: '08.00 – 14.00 WIB',
        location: 'Sekretariat & Sekolah Tuan Rumah',
        image: '/documentation/02-muskerda.jpg',
        description:
            'Forum koordinasi pengurus BPH dan lima divisi bersama perwakilan 17 ROHIS sekolah anggota untuk menyelaraskan agenda semester berjalan.',
    },
    {
        id: 'evt-3',
        title: 'Workshop Media & Kepemimpinan',
        category: 'Pelatihan',
        date: '16 Februari 2026',
        time: '08.30 – 13.00 WIB',
        location: 'Aula Pendidikan Banyumas',
        image: '/documentation/05-workshop.jpg',
        description:
            'Pelatihan manajemen organisasi, komunikasi publik, penulisan rilis kegiatan, dan desain syiar visual bagi pengurus ROHIS sekolah.',
    },
];

export default function FeatureCarousel({
    id: sectionId,
    items = [],
    type = 'news',
    variant,
    eyebrow,
    title,
    lead,
    description,
    moreTo,
    ctaHref,
    moreLabel,
    ctaLabel,
    onSelect,
}) {
    const [selection, setSelection] = useState({ index: 0, previous: 0, direction: 1 });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const gesture = useRef(null);
    const dragged = useRef(false);
    const id = useId();

    const isEvent =
        variant === 'agenda' || variant === 'events' || type === 'events';
    const resolvedItems =
        Array.isArray(items) && items.length > 0
            ? items
            : isEvent
            ? FALLBACK_EVENTS
            : FALLBACK_NEWS;

    const count = resolvedItems.length;
    const at = (position) => ((position % count) + count) % count;
    const current = at(selection.index);
    const previous = at(selection.previous);
    const before = at(current - 1);
    const next = at(current + 1);
    // Mount just the current card, its neighbours, and a card leaving on a direct jump.
    const visibleIndices = [...new Set([before, current, next, previous])];
    const direction = selection.direction;
    const move = (step) => {
        if (!step || count < 2) return;
        setSelection((old) => ({
            index: at(old.index + step),
            previous: at(old.index),
            direction: Math.sign(step),
        }));
    };
    const selectEvent = (item) =>
        onSelect ? onSelect(item) : setSelectedEvent(item);

    const finishGesture = (stage) => {
        gesture.current = null;
        delete stage.dataset.dragging;
        stage.style.removeProperty('--drag-x');
    };

    const resolvedLead = description || lead;
    const resolvedMoreTo = ctaHref || moreTo;
    const resolvedMoreLabel =
        ctaLabel || moreLabel || (isEvent ? 'Semua agenda' : 'Semua berita');

    return (
        <section id={sectionId} className="rk-showcase-section">
            <div className="rk-container">
                <div
                    className="rk-showcase"
                    data-scene={isEvent ? 'agenda' : 'news'}
                >
                    {title && (
                        <div className="rk-showcase-heading">
                            <div>
                                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                                <h2>{title}</h2>
                                {resolvedLead && <p>{resolvedLead}</p>}
                            </div>
                            {resolvedMoreTo && (
                                <Link
                                    className="rk-btn-secondary"
                                    to={resolvedMoreTo}
                                >
                                    <span>{resolvedMoreLabel}</span>
                                    <ArrowRight size={17} aria-hidden="true" />
                                </Link>
                            )}
                        </div>
                    )}

                    <div
                        className="rk-carousel"
                        role="region"
                        aria-roledescription="carousel"
                        aria-label={
                            title ||
                            (isEvent ? 'Sorotan agenda' : 'Sorotan berita')
                        }
                    >
                        <div
                            id={id}
                            className="rk-carousel-stage"
                            style={{ '--enter-x': direction < 0 ? '-16%' : '16%' }}
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (
                                    /INPUT|TEXTAREA|SELECT/.test(
                                        event.target.tagName
                                    )
                                )
                                    return;
                                if (
                                    event.key === 'ArrowRight' ||
                                    event.key === 'ArrowLeft'
                                ) {
                                    event.preventDefault();
                                    event.currentTarget.focus({ preventScroll: true });
                                    move(event.key === 'ArrowRight' ? 1 : -1);
                                }
                            }}
                            onPointerDown={(event) => {
                                dragged.current = false;
                                if (count < 2 || !event.isPrimary || event.button !== 0) return;
                                gesture.current = {
                                    id: event.pointerId,
                                    x: event.clientX,
                                    y: event.clientY,
                                    horizontal: false,
                                };
                            }}
                            onPointerMove={(event) => {
                                const start = gesture.current;
                                if (!start || start.id !== event.pointerId) return;
                                const stage = event.currentTarget;
                                const dx = event.clientX - start.x;
                                const dy = event.clientY - start.y;
                                if (!start.horizontal) {
                                    if (Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) {
                                        finishGesture(stage);
                                        return;
                                    }
                                    if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy) * 1.3) return;
                                    start.horizontal = true;
                                    dragged.current = true;
                                    stage.setPointerCapture(event.pointerId);
                                    stage.dataset.dragging = 'true';
                                }
                                const limit = stage.clientWidth * .22;
                                const offset = Math.max(-limit, Math.min(dx * .7, limit));
                                stage.style.setProperty('--drag-x', `${offset}px`);
                            }}
                            onPointerUp={(event) => {
                                const start = gesture.current;
                                if (!start || start.id !== event.pointerId) return;
                                finishGesture(event.currentTarget);
                                const dx = event.clientX - start.x;
                                const dy = event.clientY - start.y;
                                if (
                                    Math.abs(dx) > 48 &&
                                    Math.abs(dx) > Math.abs(dy) * 1.4
                                ) {
                                    dragged.current = true;
                                    move(dx < 0 ? 1 : -1);
                                }
                            }}
                            onPointerCancel={(event) => {
                                finishGesture(event.currentTarget);
                            }}
                            onPointerLeave={(event) => {
                                if (!gesture.current?.horizontal) finishGesture(event.currentTarget);
                            }}
                            onClickCapture={(event) => {
                                if (dragged.current) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    dragged.current = false;
                                }
                            }}
                        >
                            {visibleIndices.map((itemIndex) => {
                                const item = resolvedItems[itemIndex];
                                const active = itemIndex === current;
                                const neighbour = !active && (itemIndex === before || itemIndex === next);
                                let side = itemIndex === next ? 1 : -1;
                                if (itemIndex === previous && (count < 3 || !neighbour)) side = -direction;
                                const position = active ? 'active' : side < 0 ? 'previous' : 'next';
                                const category = item.category || item.type || (isEvent ? 'Kegiatan' : 'Organisasi');
                                const date = item.date ? formatIndonesianDate(item.date) : undefined;
                                const suppliedPhoto =
                                    item.image || item.photoUrl || item.photo;
                                const photo =
                                    suppliedPhoto ||
                                    ROKABA_REAL_PHOTOS[
                                        itemIndex % ROKABA_REAL_PHOTOS.length
                                    ];
                                const itemSummary =
                                    item.summary ||
                                    item.excerpt ||
                                    item.description;
                                const itemSlug =
                                    item.slug || item.id || `berita-${itemIndex + 1}`;

                                return (
                                    <article
                                        key={`${item.id || item.slug || 'item'}-${itemIndex}`}
                                        className={`rk-carousel-card rk-carousel-card--${position} rk-carousel-glass`}
                                        data-neighbour={neighbour || undefined}
                                        onPointerMove={active ? (event) => {
                                            if (event.pointerType !== 'mouse' || event.buttons) return;
                                            const card = event.currentTarget;
                                            const box = card.getBoundingClientRect();
                                            card.style.setProperty('--shine-x', `${100 * (event.clientX - box.left) / box.width}%`);
                                            card.style.setProperty('--shine-y', `${100 * (event.clientY - box.top) / box.height}%`);
                                        } : undefined}
                                        onPointerLeave={active ? (event) => {
                                            event.currentTarget.style.removeProperty('--shine-x');
                                            event.currentTarget.style.removeProperty('--shine-y');
                                        } : undefined}
                                        aria-hidden={!active}
                                        inert={!active}
                                    >
                                        <div className="rk-carousel-media">
                                            <PhotoFrame
                                                src={photo}
                                                alt={
                                                    suppliedPhoto
                                                        ? item.title
                                                        : 'Dokumentasi organisasi ROKABA'
                                                }
                                                aspect="16/10"
                                            />
                                        </div>

                                        <div className="rk-carousel-body">
                                            <span className="rk-carousel-category">{category}</span>
                                            <h3>{item.title}</h3>
                                            <div className="rk-carousel-meta">
                                                {date && (
                                                    <span>
                                                        <CalendarDays size={16} aria-hidden="true" />
                                                        {date}
                                                    </span>
                                                )}
                                                {isEvent
                                                    ? item.time && (
                                                          <span className="rk-carousel-time">
                                                              <Clock3
                                                                  size={16}
                                                                  aria-hidden="true"
                                                              />
                                                              {item.time}
                                                          </span>
                                                      )
                                                    : item.author && (
                                                          <span className="rk-carousel-author">
                                                              <UserRound
                                                                  size={16}
                                                                  aria-hidden="true"
                                                              />
                                                              {item.author}
                                                          </span>
                                                      )}
                                                {isEvent && item.location && (
                                                    <span className="rk-carousel-location">
                                                        <MapPin
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                        {item.location}
                                                    </span>
                                                )}
                                            </div>

                                            {itemSummary && (
                                                <p className="rk-carousel-excerpt">{itemSummary}</p>
                                            )}
                                            {isEvent ? (
                                                <button
                                                    type="button"
                                                    className="rk-btn-primary rk-carousel-action"
                                                    onClick={() => selectEvent(item)}
                                                >
                                                    <span>Lihat rincian</span>
                                                    <ArrowRight size={17} aria-hidden="true" />
                                                </button>
                                            ) : (
                                                <Link
                                                    className="rk-btn-primary rk-carousel-action"
                                                    to={`/berita/${itemSlug}`}
                                                >
                                                    <span>Baca selengkapnya</span>
                                                    <ArrowRight size={17} aria-hidden="true" />
                                                </Link>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="rk-carousel-controls">
                            {count > 1 && (
                                <button
                                    type="button"
                                    className="rk-carousel-arrow rk-carousel-arrow--previous"
                                    aria-label={
                                        isEvent
                                            ? 'Agenda sebelumnya'
                                            : 'Berita sebelumnya'
                                    }
                                    aria-controls={id}
                                    onClick={() => move(-1)}
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}

                            <div className="rk-carousel-pagination">
                                <span aria-live="polite" aria-atomic="true">
                                    {current + 1} / {count}
                                </span>
                                {count > 1 && (
                                    <div className="rk-carousel-dots">
                                        {resolvedItems.map((item, i) => (
                                            <button
                                                key={`${item.id || item.slug || 'item'}-${i}`}
                                                type="button"
                                                aria-label={`Tampilkan ${isEvent ? 'agenda' : 'berita'} ${i + 1}`}
                                                aria-current={i === current ? 'true' : undefined}
                                                onClick={() => move(i - current)}
                                            >
                                                <span />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {count > 1 && (
                                <button
                                    type="button"
                                    className="rk-carousel-arrow rk-carousel-arrow--next"
                                    aria-label={
                                        isEvent
                                            ? 'Agenda berikutnya'
                                            : 'Berita berikutnya'
                                    }
                                    aria-controls={id}
                                    onClick={() => move(1)}
                                >
                                    <ArrowRight size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {!onSelect && (
                        <AccessibleDialog
                            open={Boolean(selectedEvent)}
                            onClose={() => setSelectedEvent(null)}
                            title={selectedEvent?.title || 'Rincian agenda'}
                            eyebrow={
                                selectedEvent?.category ||
                                selectedEvent?.type ||
                                'Agenda ROKABA'
                            }
                        >
                            {selectedEvent && (
                                <div className="rk-carousel-dialog">
                                    <p>{selectedEvent.description}</p>
                                    <p>
                                        <strong>Tanggal:</strong>{' '}
                                        {formatIndonesianDate(
                                            selectedEvent.date
                                        )}
                                    </p>
                                    {selectedEvent.time && (
                                        <p>
                                            <strong>Waktu:</strong>{' '}
                                            {selectedEvent.time}
                                        </p>
                                    )}
                                    {selectedEvent.location && (
                                        <p>
                                            <strong>Lokasi:</strong>{' '}
                                            {selectedEvent.location}
                                        </p>
                                    )}
                                    {selectedEvent.speaker && (
                                        <p>
                                            <strong>Pemateri:</strong>{' '}
                                            {selectedEvent.speaker}
                                        </p>
                                    )}
                                </div>
                            )}
                        </AccessibleDialog>
                    )}
                </div>
            </div>
        </section>
    );
}
