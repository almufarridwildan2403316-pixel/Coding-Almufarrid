import React, { useState } from 'react';
import { BookOpen, Zap, ArrowRight } from 'lucide-react';

interface MateriProps {
  onStartLab: () => void;
}

export const Materi: React.FC<MateriProps> = ({ onStartLab }) => {
  const [activeTab, setActiveTab] = useState<'dasar' | 'klasifikasi' | 'reaksi' | 'teori'>('dasar');

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'var(--teal-50)',
            border: '1px solid var(--teal-200)',
            color: 'var(--teal-800)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <BookOpen size={15} color="var(--teal-600)" />
            <span>Materi Pembelajaran Kimia SMA Kelas X</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--navy-950)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Larutan Elektrolit & Non-Elektrolit
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', maxWidth: '750px', lineHeight: 1.6 }}>
            Pelajari landasan teori mengenai partikel bermuatan (ion), derajat ionisasi (&alpha;), serta mengapa larutan tertentu dapat mengalirkan arus listrik.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--slate-200)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {[
            { id: 'dasar', label: '1. Konsep & Arus Listrik' },
            { id: 'klasifikasi', label: '2. Klasifikasi & Derajat Ionisasi' },
            { id: 'reaksi', label: '3. Reaksi Ionisasi & Disosiasi' },
            { id: 'teori', label: '4. Teori Svante Arrhenius' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid var(--teal-600)' : '3px solid transparent',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--teal-800)' : 'var(--slate-600)',
                cursor: 'pointer',
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          {activeTab === 'dasar' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem' }}>
                Mengapa Larutan Dapat Menghantarkan Listrik?
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate-700)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Arus listrik adalah <strong>aliran partikel bermuatan</strong>. Pada kabel logam (tembaga), pembawa muatan listrik adalah <em>elektron bebas</em>. Namun di dalam wujud cairan/larutan (<em>aqueous</em>), elektron tidak mengalir bebas sendirian di dalam air, melainkan muatan listrik dibawa oleh <strong>ion-ion yang dapat bergerak bebas</strong> (kation bermuatan positif dan anion bermuatan negatif).
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                margin: '1.75rem 0'
              }}>
                <div style={{ backgroundColor: 'var(--teal-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--teal-200)' }}>
                  <h4 style={{ color: 'var(--teal-800)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={18} /> Syarat Larutan Menghantarkan Listrik:
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                    <li>Mengandung partikel bermuatan (kation dan anion).</li>
                    <li>Partikel-partikel tersebut harus <strong>bebas bergerak</strong> (tidak terkunci dalam kisi kristal padat).</li>
                    <li>Terdapat beda potensial (tegangan dari baterai DC).</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
                  <h4 style={{ color: 'var(--navy-900)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                    Kristal Garam Padat vs Larutan Garam
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                    Kristal garam $NaCl$ padat <strong>tidak dapat</strong> menghantarkan listrik karena ion $Na^+$ dan $Cl^-$ terikat sangat kuat dalam kisi kristal. Begitu dilarutkan dalam air, molekul air memisahkan ion-ion tersebut sehingga bebas bergerak menghantarkan arus listrik!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'klasifikasi' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem' }}>
                Klasifikasi Larutan & Derajat Ionisasi (&alpha;)
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate-700)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Kekuatan daya hantar listrik larutan ditentukan oleh konsentrasi ion bebas di dalamnya, yang sangat dipengaruhi oleh <strong>derajat ionisasi (&alpha;)</strong>:
              </p>

              <div style={{
                backgroundColor: 'var(--slate-900)',
                color: '#ffffff',
                padding: '1.25rem',
                borderRadius: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                textAlign: 'center',
                marginBottom: '1.75rem'
              }}>
                &alpha; = (Jumlah mol zat yang terionisasi) / (Jumlah mol zat yang dilarutkan)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div style={{ border: '1px solid var(--strong-border)', backgroundColor: 'var(--strong-bg)', padding: '1.25rem', borderRadius: '12px' }}>
                  <div className="badge badge-strong" style={{ marginBottom: '0.5rem' }}>Elektrolit Kuat</div>
                  <h4 style={{ color: 'var(--strong-text)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>&alpha; = 1 (100%)</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                    Seluruh zat terlarut terurai menjadi ion. Menghasilkan lampu menyala terang dan banyak gelembung gas di elektroda.<br />
                    <em>Contoh: NaCl, HCl, H₂SO₄, NaOH.</em>
                  </p>
                </div>

                <div style={{ border: '1px solid var(--weak-border)', backgroundColor: 'var(--weak-bg)', padding: '1.25rem', borderRadius: '12px' }}>
                  <div className="badge badge-weak" style={{ marginBottom: '0.5rem' }}>Elektrolit Lemah</div>
                  <h4 style={{ color: 'var(--weak-text)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>0 &lt; &alpha; &lt; 1</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                    Hanya sebagian kecil molekul yang terionisasi (biasanya &lt; 5%), sisanya tetap berupa molekul netral. Lampu redup atau padam, gelembung sedikit.<br />
                    <em>Contoh: CH₃COOH, NH₃, HF.</em>
                  </p>
                </div>

                <div style={{ border: '1px solid var(--non-border)', backgroundColor: 'var(--non-bg)', padding: '1.25rem', borderRadius: '12px' }}>
                  <div className="badge badge-none" style={{ marginBottom: '0.5rem' }}>Non-Elektrolit</div>
                  <h4 style={{ color: 'var(--non-text)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>&alpha; = 0 (0%)</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
                    Zat terlarut terdispersi sebagai molekul netral tanpa membentuk ion sama sekali. Lampu padam dan tidak ada gelembung gas.<br />
                    <em>Contoh: Sukrosa (gula), Etanol, Urea.</em>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reaksi' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem' }}>
                Penulisan Persamaan Reaksi Kimia
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate-700)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Perhatikan perbedaan tanda panah pada persamaan disosiasi elektrolit kuat (tanda panah satu arah &rarr;) dan elektrolit lemah (tanda panah kesetimbangan &lArr;&rArr;):
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    1. Garam Kuat (Senyawa Ionik):
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    NaCl(s) &rarr; Na⁺(aq) + Cl⁻(aq)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                    Tanda panah tunggal (&rarr;) menandakan proses disosiasi berlangsung sempurna 100%.
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    2. Asam Lemah (Ionisasi Sebagian):
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    CH₃COOH(aq) ⇌ H⁺(aq) + CH₃COO⁻(aq)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                    Tanda panah bolak-balik (⇌) menunjukkan kesetimbangan dinamis antara molekul netral dan sedikit ion yang terbentuk.
                  </div>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    3. Senyawa Non-Elektrolit (Hanya Pelarutan):
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    C₁₂H₂₂O₁₁(s) &rarr; C₁₂H₂₂O₁₁(aq)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
                    Molekul gula sukrosa tetap utuh sebagai molekul netral di dalam air, tidak terurai menjadi ion.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teori' && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: '1rem' }}>
                Teori Ionisasi Svante Arrhenius (1887)
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate-700)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Ilmuwan asal Swedia, <strong>Svante August Arrhenius</strong>, pada tahun 1887 mengemukakan teori revolusioner bahwa zat elektrolit jika dilarutkan dalam air akan terurai menjadi partikel-partikel bermuatan listrik yang dinamakan <em>ion</em>.
              </p>
              <div style={{ backgroundColor: 'var(--teal-50)', borderLeft: '4px solid var(--teal-600)', padding: '1.25rem 1.5rem', borderRadius: '0 8px 8px 0', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--teal-900)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "Daya hantar listrik suatu larutan tidak ditentukan oleh zat itu sendiri dalam wujud aslinya, melainkan ditentukan oleh keberadaan dan banyaknya ion bebas yang dihasilkan saat zat tersebut dilarutkan dalam air."
                </p>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-800)', marginTop: '0.5rem' }}>
                  — Svante Arrhenius (Penerima Hadiah Nobel Kimia 1903)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA to Lab */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--slate-200)',
          padding: '1.5rem 2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Sudah Memahami Konsepnya?
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
              Uji pemahaman Anda dengan melakukan eksperimen langsung di Laboratorium Virtual.
            </p>
          </div>
          <button
            onClick={onStartLab}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <span>Buka Laboratorium Virtual</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
