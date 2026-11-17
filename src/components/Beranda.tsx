import { useState } from 'react';
import type { ActivePage, HomePromptResponse, LearningProgress } from '../types/chemistry';
import { ArrowRight, FlaskConical, Lightbulb, Save } from 'lucide-react';
import './Beranda.css';

interface BerandaProps {
  progress: LearningProgress;
  setActivePage: (page: ActivePage) => void;
  onSaveHomePromptResponse: (response: HomePromptResponse) => void;
}

export const Beranda = ({ progress, setActivePage, onSaveHomePromptResponse }: BerandaProps) => {
  const savedResponse = progress.homePromptResponse ?? null;
  const [answer, setAnswer] = useState(savedResponse?.text ?? '');
  const [saveError, setSaveError] = useState('');
  const savedAt = savedResponse?.submittedAt ?? '';

  const openNextFeature = () => {
    setActivePage('materi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveAnswer = () => {
    const text = answer.trim();
    if (!text) return;
    const response = { text, submittedAt: new Date().toISOString() };
    try {
      onSaveHomePromptResponse(response);
      setSaveError('');
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : 'Jawaban pemantik gagal disimpan.');
    }
  };

  const hasUnsavedChanges = answer.trim() !== (savedResponse?.text ?? '');

  return (
    <section className="home-intro" aria-labelledby="home-intro-title">
      <div className="home-intro-content">
        <div className="home-intro-copy">
          <span className="home-intro-kicker">
            <FlaskConical size={16} aria-hidden="true" />
            MEDIA PEMBELAJARAN KIMIA
          </span>
          <h1 id="home-intro-title">
            Larutan Elektrolit dan <span>Non-Elektrolit</span>
          </h1>
          <p>
            Kenali perbedaan, sifat, dan contoh larutan yang dapat atau tidak dapat menghantarkan listrik.
          </p>
          <section className="home-intro-prompt" aria-labelledby="home-prompt-title">
            <h2 id="home-prompt-title">Pemantik Pembelajaran</h2>
            <div className="home-intro-question">
              <Lightbulb size={19} aria-hidden="true" />
              <div>
                <strong>Pertanyaan pemantik</strong>
                <p>
                  Mengapa air garam dapat menghantarkan listrik, sedangkan air gula hampir tidak? Menurut dugaanmu, bagaimana nyala lampu dan gelembung yang mungkin terlihat?
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="home-intro-video">
          <div className="home-intro-video-frame">
            <iframe
              src="https://www.youtube.com/embed/RsGBcP4alDo?si=Y0zdseVdfvk8T05v"
              title="Video pengantar dunia larutan"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p>
            Video pengantar: amati bagaimana larutan berperilaku saat diuji.{' '}
            <a href="https://www.youtube.com/watch?v=RsGBcP4alDo" target="_blank" rel="noreferrer">
              Tonton langsung di YouTube
            </a>
          </p>
        </div>

        <form
          className="home-intro-answer"
          onSubmit={(event) => {
            event.preventDefault();
            saveAnswer();
          }}
        >
          <label htmlFor="initial-thought">Tuliskan dugaan awalmu</label>
          <textarea
            id="initial-thought"
            rows={3}
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setSaveError('');
            }}
            placeholder="Menurut saya, air garam dapat menghantarkan listrik karena..."
            aria-describedby="initial-thought-note"
          />
          <p id="initial-thought-note">
            Dugaan awal ini tidak dinilai. Kamu dapat menyimpan jawaban sekarang dan memperbaruinya nanti.
          </p>
          <div className="home-intro-answer-actions">
            <button type="submit" disabled={!answer.trim() || !hasUnsavedChanges}>
              <Save size={16} aria-hidden="true" />
              Simpan Jawaban
            </button>
            <span role="status" aria-live="polite">
              {saveError || (savedAt && !hasUnsavedChanges
                ? `Jawaban tersimpan ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(savedAt))}`
                : hasUnsavedChanges && answer.trim()
                  ? 'Ada perubahan yang belum disimpan.'
                  : '')}
            </span>
          </div>
        </form>
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
