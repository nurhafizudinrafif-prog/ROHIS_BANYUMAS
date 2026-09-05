import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../utils';
import HeroSection from '../components/HeroSection';
import StatsCounter from '../components/StatsCounter';
import SectionHeader from '../components/SectionHeader';
import ProgramCard from '../components/ProgramCard';
import ArticleCard from '../components/ArticleCard';
import EventCard from '../components/EventCard';
import MemberSchoolCard from '../components/MemberSchoolCard';
import QuoteSection from '../components/QuoteSection';
import { programs } from '../data/programs';
import { articles } from '../data/articles';
import { events } from '../data/events';
import { memberSchools } from '../data/memberSchools';
import './Home.css';

export default function Home() {
  useScrollAnimation();

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
    </main>
  );
}
