import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, X, Calendar } from 'lucide-react';
import { useScrollAnimation } from '../utils';
import HeroSection from '../components/HeroSection';
import StatsCounter from '../components/StatsCounter';
import SectionHeader from '../components/SectionHeader';
import ProgramCard from '../components/ProgramCard';
import ArticleCard from '../components/ArticleCard';
import EventCard from '../components/EventCard';
import MemberSchoolCard from '../components/MemberSchoolCard';
import TeamCard from '../components/TeamCard';
import QuoteSection from '../components/QuoteSection';
import { programs } from '../data/programs';
import { articles } from '../data/articles';
import { events } from '../data/events';
import { memberSchools } from '../data/memberSchools';
import { galleryItems } from '../data/gallery';
import { team, structurePeriod, organizationFullName } from '../data/team';
import './Home.css';
import './Gallery.css';

export default function Home() {
  useScrollAnimation();
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <main>
      <HeroSection />
      <StatsCounter />

      {/* Programs Section */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Program Kerja"
            title="Lima Pilar Gerakan Kami"
            subtitle="Digerakkan melalui 5 divisi utama: SDM, Dakwah, Jurnalistik, HUMAS, dan DANUS untuk membentuk generasi Islam yang berdaya dan berdampak."
          />
          <div className="home-programs-grid">
            {programs.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/program" className="btn btn-outline">
              Lihat Semua Program <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <QuoteSection />

      {/* Upcoming Events */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Agenda"
            title="Kegiatan Mendatang"
            subtitle="Jadwal kajian, pelatihan, dan kegiatan sosial yang akan datang. Catat tanggalnya!"
          />
          <div className="home-events-list">
            {events
              .filter((e) => e.status === 'upcoming')
              .slice(0, 3)
              .map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/agenda" className="btn btn-outline">
              Lihat Semua Agenda <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Artikel Dakwah"
            title="Bacaan Terbaru"
            subtitle="Artikel, kajian, dan tulisan inspiratif untuk meningkatkan keilmuan dan keimanan."
          />
          <div className="grid grid-3">
            {articles.slice(0, 3).map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/artikel" className="btn btn-outline">
              Lihat Semua Artikel <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Dokumentasi"
            title="Galeri Kegiatan"
            subtitle="Potret semangat kebersamaan dan aksi nyata kegiatan dakwah pelajar ROHIS se-Kabupaten Banyumas."
          />
          <div className="gallery-grid">
            {galleryItems.slice(0, 6).map((item, i) => (
              <div
                key={item.id}
                className={`gallery-item animate-on-scroll delay-${(i % 3) + 1}`}
                onClick={() => setSelectedItem(item)}
                title="Klik untuk melihat dokumentasi"
              >
                <div className="gallery-item-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-item-img"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <span className="gallery-item-emoji">{item.emoji}</span>
                      <Camera size={20} className="gallery-item-camera" />
                    </>
                  )}
                </div>
                <div className="gallery-item-overlay">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span className="badge badge-primary">{item.category}</span>
                    {item.date && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {item.date}
                      </span>
                    )}
                  </div>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/galeri" className="btn btn-outline">
              Lihat Semua Galeri <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Leadership / BPH Showcase */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge={`Struktur ${structurePeriod}`}
            title="Badan Pengurus Harian (BPH)"
            subtitle={`Pimpinan inti yang mengarahkan visi dan roda pergerakan ${organizationFullName} Periode ${structurePeriod}.`}
          />
          <div className="team-grid-bph">
            {team.bph.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/rohis-anggota" className="btn btn-outline">
              Lihat Struktur Lengkap 5 Divisi & 40 Pengurus <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Member Schools */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Jaringan"
            title="ROHIS Anggota Kami"
            subtitle="Lebih dari 15 sekolah di Kabupaten Banyumas tergabung dalam organisasi ini."
          />
          <div className="grid grid-4">
            {memberSchools.slice(0, 4).map((school, i) => (
              <MemberSchoolCard key={school.id} school={school} index={i} />
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <Link to="/rohis-anggota" className="btn btn-outline">
              Lihat Semua ROHIS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section home-cta-section pattern-bg">
        <div className="container text-center">
          <div className="home-cta animate-on-scroll">
            <h2>Siap Bergabung Bersama Kami?</h2>
            <p>
              Jadilah bagian dari gerakan dakwah pemuda Islam terbesar di Kabupaten Banyumas.
              Bersama, kita wujudkan generasi yang berilmu, berakhlak, dan berdampak.
            </p>
            <div className="home-cta-actions">
              <Link to="/pendaftaran" className="btn btn-gold btn-lg">
                Daftar Sekarang
              </Link>
              <Link to="/kontak" className="btn btn-outline btn-lg">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            <div className="gallery-modal-body">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="gallery-modal-img"
                />
              ) : (
                <div className="gallery-modal-placeholder">
                  <span>{selectedItem.emoji}</span>
                  <p>Belum ada foto yang diunggah</p>
                </div>
              )}
            </div>

            <div className="gallery-modal-info">
              <div>
                <h3>{selectedItem.title}</h3>
              </div>
              <div className="gallery-modal-meta">
                <span className="badge badge-primary">{selectedItem.category}</span>
                {selectedItem.date && (
                  <span className="gallery-modal-date">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                    {selectedItem.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
