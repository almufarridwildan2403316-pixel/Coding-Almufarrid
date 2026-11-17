import type { ActivePage } from '../types/chemistry';
import { ArrowRight, Atom, FlaskConical, Lightbulb } from 'lucide-react';
import './Beranda.css';

interface BerandaProps {
  setActivePage: (page: ActivePage) => void;
}

export const Beranda = ({ setActivePage }: BerandaProps) => {
  const openNextFeature = () => {
    setActivePage('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="home-intro" aria-labelledby="home-intro-title">
      <div className="home-intro-content">
        <div className="home-intro-copy">
          <span className="home-intro-kicker">
            <FlaskConical size={16} aria-hidden="true" />
            PEMANTIK PEMBELAJARAN
          </span>
          <h1 id="home-intro-title">
            Mengapa ada larutan yang menyalakan lampu, sementara yang lain tidak?
          </h1>
          <p>
            Dua larutan bisa terlihat sama, tetapi menunjukkan perilaku berbeda saat diuji dengan rangkaian listrik.
            Apa yang terjadi di dalam larutan hingga lampu dapat menyala?
          </p>
          <div className="home-intro-question">
            <Lightbulb size={19} aria-hidden="true" />
            <span>
              <strong>Coba pikirkan:</strong> adakah partikel dalam larutan yang dapat bergerak dan membawa muatan?
            </span>
          </div>
          <div className="home-intro-answer">
            <label htmlFor="initial-thought">Tuliskan dugaan awalmu</label>
            <textarea
              id="initial-thought"
              rows={3}
              placeholder="Menurut saya, larutan dapat menyalakan lampu karena..."
              aria-describedby="initial-thought-note"
            />
            <p id="initial-thought-note">
              Jawaban bersifat terbuka, tidak dinilai, dan tidak ada jawaban benar atau salah.
            </p>
          </div>
        </div>

        <div className="home-intro-visual" aria-hidden="true">
          <div className="home-intro-orbit home-intro-orbit--outer" />
          <div className="home-intro-orbit home-intro-orbit--inner" />
          <div className="home-intro-beaker">
            <div className="home-intro-liquid">
              <span className="home-intro-particle home-intro-particle--one">+</span>
              <span className="home-intro-particle home-intro-particle--two">−</span>
              <span className="home-intro-particle home-intro-particle--three">+</span>
              <span className="home-intro-particle home-intro-particle--four">?</span>
            </div>
          </div>
          <span className="home-intro-atom home-intro-atom--one"><Atom size={21} /></span>
          <span className="home-intro-atom home-intro-atom--two"><Atom size={16} /></span>
          <span className="home-intro-visual-caption">Apa yang ada di dalam larutan?</span>
        </div>
      </div>

      <div className="home-intro-next">
        <span className="home-intro-next-hint">Mulai dengan mengenal konsep dasarnya</span>
        <button type="button" onClick={openNextFeature}>
          <span className="home-intro-next-copy">
            <span>Selanjutnya</span>
            <strong>Materi Konsep</strong>
          </span>
          <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
