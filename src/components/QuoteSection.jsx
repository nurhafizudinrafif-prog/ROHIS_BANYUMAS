import './QuoteSection.css';

export default function QuoteSection({
  arabic = 'وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا وَقَالَ إِنَّنِي مِنَ الْمُسْلِمِينَ',
  translation = '"Dan siapakah yang lebih baik perkataannya daripada orang yang menyeru kepada Allah, mengerjakan amal yang saleh, dan berkata: Sesungguhnya aku termasuk orang-orang Muslim."',
  reference = 'QS. Fussilat: 33',
}) {
  return (
    <section className="quote-section pattern-bg">
      <div className="container">
        <div className="quote-card">
          <p className="quote-arabic">{arabic}</p>
          <div className="ornament-separator">
            <span className="ornament-diamond"></span>
          </div>
          <p className="quote-translation">{translation}</p>
          <span className="quote-reference">— {reference}</span>
        </div>
      </div>
    </section>
  );
}
