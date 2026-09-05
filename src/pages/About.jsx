import { useScrollAnimation } from '../utils';
import SectionHeader from '../components/SectionHeader';
import TeamCard from '../components/TeamCard';
import { team } from '../data/team';
import { Target, Eye, Heart, BookOpen, Users, Shield } from 'lucide-react';
import './About.css';

export default function About() {
  useScrollAnimation();

  return (
    <main className="page-about">
      {/* Page Hero */}
      <section className="page-hero pattern-bg">
        <div className="container text-center">
          <span className="badge badge-primary animate-hero delay-0">Tentang Kami</span>
          <h1 className="page-hero-title animate-hero delay-1">Organisasi ROHIS Kabupaten Banyumas</h1>
          <p className="page-hero-subtitle animate-hero delay-2">
            Bersatu dalam dakwah, bergerak untuk umat — menginspirasi generasi muda Islam Banyumas.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="section">
        <div className="container">
          <div className="about-story animate-on-scroll">
            <div className="about-story-content">
              <h2>Sejarah & Latar Belakang</h2>
              <p>
                Organisasi ROHIS Kabupaten Banyumas didirikan pada tahun 2017 sebagai wadah koordinasi 
                dan silaturahmi antar ROHIS (Rohani Islam) sekolah tingkat SMA/SMK/MA se-Kabupaten 
                Banyumas, Jawa Tengah.
              </p>
              <p>
                Berawal dari inisiatif beberapa pengurus ROHIS sekolah yang merasa perlu adanya 
                sinergi dan kolaborasi lintas sekolah, organisasi ini terus berkembang hingga kini 
                menjadi pusat dakwah pemuda Islam yang menaungi lebih dari 15 sekolah di Kabupaten Banyumas 
                dengan puluhan kader dakwah aktif.
              </p>
              <p>
                Selain mengkoordinasikan kegiatan antar ROHIS, organisasi ini juga menyelenggarakan 
                program-program dakwah, pendidikan, sosial, dan pengembangan kapasitas yang 
                terbuka untuk seluruh pemuda Muslim di Kabupaten Banyumas.
              </p>
            </div>
            <div className="about-story-visual">
              <div className="about-story-card">
                <span className="about-story-year">2017</span>
                <span className="about-story-label">Tahun Berdiri</span>
              </div>
              <div className="about-story-card">
                <span className="about-story-year">15+</span>
                <span className="about-story-label">Dari Sekolah Kab. Banyumas</span>
              </div>
              <div className="about-story-card">
                <span className="about-story-year">53+</span>
                <span className="about-story-label">Anggota Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Visi & Misi"
            title="Arah Gerak Kami"
          />
          <div className="about-vm-grid">
            <div className="about-vm-card animate-on-scroll delay-1">
              <div className="about-vm-icon">
                <Eye size={32} />
              </div>
              <h3>Visi</h3>
              <p>
                Menjadi organisasi pemuda Islam yang unggul, berilmu, berakhlak mulia, dan 
                berdampak positif bagi masyarakat Kabupaten Banyumas dan sekitarnya.
              </p>
            </div>
            <div className="about-vm-card animate-on-scroll delay-2">
              <div className="about-vm-icon about-vm-icon-gold">
                <Target size={32} />
              </div>
              <h3>Misi</h3>
              <ul>
                <li>Menyelenggarakan kajian dan dakwah Islam yang ilmiah dan kontekstual</li>
                <li>Membangun jaringan dan koordinasi antar ROHIS se-Kabupaten Banyumas</li>
                <li>Mengembangkan kapasitas kepemimpinan dan keterampilan kader dakwah</li>
                <li>Melaksanakan aksi sosial dan kemanusiaan berbasis ukhuwah Islamiyah</li>
                <li>Memanfaatkan media digital sebagai sarana dakwah yang efektif dan kreatif</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Nilai-Nilai"
            title="Prinsip yang Kami Pegang"
          />
          <div className="grid grid-3 about-values-grid">
            {[
              { icon: BookOpen, title: 'Ilmu', desc: 'Mengedepankan ilmu sebagai landasan setiap gerak dan dakwah.' },
              { icon: Heart, title: 'Ikhlas', desc: 'Beramal dengan ketulusan hati, mengharap ridha Allah semata.' },
              { icon: Users, title: 'Ukhuwah', desc: 'Membangun persaudaraan yang kuat sesama Muslim dan warga.' },
              { icon: Shield, title: 'Amanah', desc: 'Memegang teguh kepercayaan yang diberikan dengan penuh tanggung jawab.' },
              { icon: Target, title: 'Istiqomah', desc: 'Konsisten dalam kebaikan meski menghadapi berbagai tantangan.' },
              { icon: Eye, title: 'Transparansi', desc: 'Terbuka dalam pengelolaan organisasi dan program kerja.' },
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className={`about-value-card animate-on-scroll delay-${(i % 3) + 1}`}>
                  <div className="about-value-icon">
                    <Icon size={24} />
                  </div>
                  <h4>{val.title}</h4>
                  <p>{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section-alt">
        <div className="container">
          <SectionHeader
            badge="Kepengurusan"
            title="Badan Pengurus Harian"
            subtitle="Pengurus inti yang menjalankan roda Organisasi ROHIS Kabupaten Banyumas."
          />
          <div className="grid grid-4">
            {team.bph.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-3xl)' }}>
            <SectionHeader
              title="Bidang Kepengurusan"
              subtitle="Struktur bidang yang menjalankan program kerja organisasi."
            />
            <div className="grid grid-2">
              {team.departments.map((dept, i) => (
                <div key={dept.id} className={`about-dept-card card animate-on-scroll delay-${(i % 2) + 1}`}>
                  <div className="card-body">
                    <h4>{dept.name}</h4>
                    <p>Kepala Bidang: <strong>{dept.head}</strong></p>
                    <span className="badge badge-primary">{dept.members} anggota</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
