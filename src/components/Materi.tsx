import React from 'react';
import { ArrowRight, BookOpen, FlaskConical } from 'lucide-react';

interface MateriProps {
  onStartLab: () => void;
}

type ModuleItem = {
  id: string;
  title: string;
  objectives: string[];
  content: React.ReactNode;
};

const sectionTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: 'var(--navy-900)',
  marginBottom: '1rem',
  letterSpacing: '0',
};

const paragraph: React.CSSProperties = {
  fontSize: '0.96rem',
  color: 'var(--slate-700)',
  lineHeight: 1.8,
  marginBottom: '1rem',
  textAlign: 'justify',
};

const subTitle: React.CSSProperties = {
  fontSize: '1.08rem',
  fontWeight: 750,
  color: 'var(--navy-900)',
  marginTop: '1.6rem',
  marginBottom: '0.75rem',
};

const cardStyle: React.CSSProperties = {
  padding: '1.35rem',
  borderRadius: '14px',
  margin: '1.1rem 0',
  border: '1px solid var(--slate-200)',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '1.4rem',
  color: 'var(--slate-700)',
  fontSize: '0.94rem',
  lineHeight: 1.9,
};

const equationStyle: React.CSSProperties = {
  backgroundColor: 'var(--slate-50)',
  color: 'var(--text-main)',
  padding: '1rem 1.1rem',
  borderRadius: '10px',
  border: '1px solid var(--slate-200)',
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 500,
  fontFamily: 'var(--font-sans)',
  lineHeight: 1.6,
  margin: '1rem 0',
  overflowX: 'auto',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.88rem',
  minWidth: '450px',
};

const cellStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--slate-200)',
  textAlign: 'left',
  color: 'var(--slate-700)',
  verticalAlign: 'top',
};

const InfoBox = ({
  title,
  children,
  color = 'teal',
}: {
  title: string;
  children: React.ReactNode;
  color?: 'teal' | 'green' | 'orange' | 'gray';
}) => {
  const backgrounds = {
    teal: 'var(--teal-50)',
    green: 'var(--strong-bg)',
    orange: 'var(--weak-bg)',
    gray: 'var(--slate-50)',
  };

  const borders = {
    teal: 'var(--teal-600)',
    green: 'var(--strong-border)',
    orange: 'var(--weak-border)',
    gray: 'var(--slate-300)',
  };

  return (
    <div
      style={{
        ...cardStyle,
        backgroundColor: backgrounds[color],
        borderLeft: `4px solid ${borders[color]}`,
      }}
    >
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: 750,
          color: 'var(--navy-900)',
          marginBottom: '0.6rem',
        }}
      >
        {title}
      </h4>
      <div
        style={{
          fontSize: '0.93rem',
          lineHeight: 1.8,
          color: 'var(--slate-700)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const DataTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
    <table style={tableStyle}>
      <thead>
        <tr style={{ backgroundColor: 'var(--slate-900)', color: '#ffffff' }}>
          {headers.map((header, index) => (
            <th
              key={index}
              style={{
                padding: '13px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, cellIndex) => (
              <td
                key={cellIndex}
                style={{
                  ...cellStyle,
                  backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : 'var(--slate-50)',
                }}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReferenceList = () => (
  <div style={{ ...cardStyle, backgroundColor: 'var(--slate-50)' }}>
    <h3 style={subTitle}>Referensi / Sumber Pustaka</h3>
    <ol style={{ ...listStyle, lineHeight: 1.9 }}>
      <li>Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Buku Teks Kimia untuk SMA/MA Kelas X, Kurikulum Merdeka.</li>
      <li>Chang, R. Chemistry. McGraw-Hill Education.</li>
      <li>Brown, T. L., LeMay, H. E., Bursten, B. E., Murphy, C., Woodward, P. Chemistry: The Central Science. Pearson.</li>
      <li>Whitten, K. W., Davis, R. E., Peck, M. L., Stanley, G. G. General Chemistry. Cengage Learning.</li>
      <li>Atkins, P., & de Paula, J. Physical Chemistry. Oxford University Press.</li>
    </ol>
  </div>
);

const ParticleVisual = () => (
  <figure
    style={{
      ...cardStyle,
      padding: '1rem',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 58%, #fff7ed 100%)',
      borderRadius: '8px',
    }}
  >
    <style>{`@media (max-width: 520px) { .materi-particle-wide { display: none !important; } .materi-particle-mobile { display: block !important; } }`}</style>
    <svg className="materi-particle-wide" viewBox="0 0 720 250" role="img" aria-labelledby="particle-title particle-desc" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <title id="particle-title">Perbandingan partikel garam dan gula dalam air</title>
      <desc id="particle-desc">Garam terpisah menjadi ion natrium dan klorida yang tersebar. Gula tetap sebagai molekul netral.</desc>
      <rect x="12" y="12" width="330" height="220" rx="18" fill="#ffffff" stroke="#99f6e4" strokeWidth="2" />
      <rect x="378" y="12" width="330" height="220" rx="18" fill="#ffffff" stroke="#fed7aa" strokeWidth="2" />
      <text x="177" y="43" textAnchor="middle" fill="#115e59" fontSize="18" fontWeight="700">Garam dalam air</text>
      <text x="543" y="43" textAnchor="middle" fill="#9a3412" fontSize="18" fontWeight="700">Gula dalam air</text>
      <path d="M38 72v112q0 18 18 18h252q18 0 18-18V72" fill="#ecfeff" stroke="#0d9488" strokeWidth="3" />
      <path d="M404 72v112q0 18 18 18h252q18 0 18-18V72" fill="#fff7ed" stroke="#ea580c" strokeWidth="3" />
      <path d="M41 121h282v62q0 16-16 16H57q-16 0-16-16z" fill="#99f6e4" opacity="0.58" />
      <path d="M407 121h282v62q0 16-16 16H423q-16 0-16-16z" fill="#fed7aa" opacity="0.55" />
      <g fontSize="15" fontWeight="700" textAnchor="middle">
        <circle cx="94" cy="107" r="20" fill="#0d9488" /><text x="94" y="112" fill="#fff">Na⁺</text>
        <circle cx="161" cy="158" r="20" fill="#f97316" /><text x="161" y="163" fill="#fff">Cl⁻</text>
        <circle cx="239" cy="103" r="20" fill="#f97316" /><text x="239" y="108" fill="#fff">Cl⁻</text>
        <circle cx="280" cy="166" r="20" fill="#0d9488" /><text x="280" y="171" fill="#fff">Na⁺</text>
        <circle cx="99" cy="168" r="20" fill="#f97316" /><text x="99" y="173" fill="#fff">Cl⁻</text>
        <circle cx="199" cy="101" r="20" fill="#0d9488" /><text x="199" y="106" fill="#fff">Na⁺</text>
        <rect x="446" y="91" width="80" height="42" rx="21" fill="#c2410c" /><text x="486" y="118" fill="#fff">C₆H₁₂O₆</text>
        <rect x="553" y="151" width="80" height="42" rx="21" fill="#c2410c" /><text x="593" y="178" fill="#fff">C₆H₁₂O₆</text>
        <rect x="571" y="86" width="80" height="42" rx="21" fill="#c2410c" /><text x="611" y="113" fill="#fff">C₆H₁₂O₆</text>
      </g>
    </svg>
    <svg className="materi-particle-mobile" viewBox="0 0 360 480" role="img" aria-labelledby="particle-mobile-title particle-mobile-desc" style={{ display: 'none', width: '100%', height: 'auto' }}>
      <title id="particle-mobile-title">Partikel garam dan gula dalam air</title>
      <desc id="particle-mobile-desc">Panel atas menunjukkan garam yang terpisah menjadi ion, panel bawah menunjukkan molekul gula netral yang tersebar.</desc>
      <rect x="12" y="10" width="336" height="220" rx="16" fill="#ffffff" stroke="#99f6e4" strokeWidth="2" />
      <rect x="12" y="248" width="336" height="220" rx="16" fill="#ffffff" stroke="#fed7aa" strokeWidth="2" />
      <text x="180" y="42" textAnchor="middle" fill="#115e59" fontSize="18" fontWeight="700">Garam dalam air</text>
      <text x="180" y="280" textAnchor="middle" fill="#9a3412" fontSize="18" fontWeight="700">Gula dalam air</text>
      <path d="M38 66v112q0 18 18 18h248q18 0 18-18V66" fill="#ecfeff" stroke="#0d9488" strokeWidth="3" />
      <path d="M38 126h284v52q0 18-18 18H56q-18 0-18-18z" fill="#99f6e4" opacity="0.58" />
      <path d="M38 304v42h284v-42" fill="#fff7ed" stroke="#ea580c" strokeWidth="3" />
      <path d="M38 324h284v22H38z" fill="#fed7aa" opacity="0.55" />
      <g fontSize="14" fontWeight="700" textAnchor="middle">
        <circle cx="90" cy="100" r="18" fill="#0d9488" /><text x="90" y="105" fill="#fff">Na⁺</text>
        <circle cx="151" cy="155" r="18" fill="#f97316" /><text x="151" y="160" fill="#fff">Cl⁻</text>
        <circle cx="220" cy="99" r="18" fill="#f97316" /><text x="220" y="104" fill="#fff">Cl⁻</text>
        <circle cx="278" cy="158" r="18" fill="#0d9488" /><text x="278" y="163" fill="#fff">Na⁺</text>
        <rect x="55" y="365" width="100" height="40" rx="20" fill="#c2410c" /><text x="105" y="390" fill="#fff">C₆H₁₂O₆</text>
        <rect x="205" y="365" width="100" height="40" rx="20" fill="#c2410c" /><text x="255" y="390" fill="#fff">C₆H₁₂O₆</text>
        <rect x="130" y="416" width="100" height="40" rx="20" fill="#c2410c" /><text x="180" y="441" fill="#fff">C₆H₁₂O₆</text>
      </g>
    </svg>
    <figcaption style={{ color: 'var(--slate-600)', fontSize: '0.86rem', lineHeight: 1.65 }}>
      Garam terurai menjadi ion bergerak, sedangkan gula larut sebagai molekul netral. Air hanya digambarkan sebagai latar agar partikel zat terlarut mudah dibandingkan.
    </figcaption>
  </figure>
);

const CircuitVisual = () => (
  <figure
    style={{
      ...cardStyle,
      padding: '1rem',
      background: 'linear-gradient(135deg, #ecfeff 0%, #ffffff 55%, #f0fdf4 100%)',
      borderRadius: '8px',
    }}
  >
    <style>{`@media (max-width: 520px) { .materi-circuit-wide { display: none !important; } .materi-circuit-mobile { display: block !important; } }`}</style>
    <svg className="materi-circuit-wide" viewBox="0 0 720 290" role="img" aria-labelledby="circuit-title circuit-desc" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <title id="circuit-title">Skema alat uji daya hantar larutan</title>
      <desc id="circuit-desc">Rangkaian baterai bertegangan rendah, lampu indikator, dan dua elektroda yang dicelupkan ke larutan.</desc>
      <path d="M116 132V72h175M425 72h179v60M604 196v38H116v-38" fill="none" stroke="#0f766e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="358" cy="72" r="46" fill="#fef3c7" stroke="#f59e0b" strokeWidth="5" />
      <path d="M339 53l38 38m0-38l-38 38" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
      <path d="M116 124v18m-15 0h30m-25 12h20m-10 0v42" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
      <path d="M536 158v58q0 15 15 15h106q15 0 15-15v-58" fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      <path d="M540 184h128v31q0 12-12 12h-104q-12 0-12-12z" fill="#67e8f9" opacity="0.6" />
      <path d="M570 72v92m70-92v92" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />
      <circle cx="584" cy="194" r="8" fill="#0d9488" /><circle cx="604" cy="204" r="7" fill="#f97316" />
      <circle cx="625" cy="190" r="6" fill="#0d9488" />
      <text x="116" y="270" textAnchor="middle" fill="#334155" fontSize="16" fontWeight="700">Baterai rendah</text>
      <text x="358" y="143" textAnchor="middle" fill="#334155" fontSize="15">Lampu indikator</text>
      <text x="604" y="270" textAnchor="middle" fill="#334155" fontSize="16" fontWeight="700">Sampel larutan</text>
      <text x="604" y="121" textAnchor="middle" fill="#475569" fontSize="14">Elektroda</text>
    </svg>
    <svg className="materi-circuit-mobile" viewBox="0 0 360 430" role="img" aria-labelledby="circuit-mobile-title circuit-mobile-desc" style={{ display: 'none', width: '100%', height: 'auto' }}>
      <title id="circuit-mobile-title">Skema vertikal alat uji larutan</title>
      <desc id="circuit-mobile-desc">Sumber baterai dan lampu indikator terhubung ke dua elektroda di dalam sampel larutan.</desc>
      <path d="M78 72V38h88m40 0h82v128m-30 20v38m-82 0v-38m-18 0H78V92" fill="none" stroke="#0f766e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="186" cy="38" r="22" fill="#fef3c7" stroke="#f59e0b" strokeWidth="4" />
      <path d="M176 28l20 20m0-20l-20 20" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 55v30m-10 0h20m-16 8h12" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
      <path d="M88 188v148q0 18 18 18h150q18 0 18-18V188" fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
      <path d="M92 264h178v72q0 14-14 14H106q-14 0-14-14z" fill="#67e8f9" opacity="0.55" />
      <path d="M136 176v117m90-117v117" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
      <circle cx="157" cy="304" r="7" fill="#0d9488" /><circle cx="181" cy="315" r="6" fill="#f97316" /><circle cx="204" cy="300" r="6" fill="#0d9488" />
      <text x="78" y="119" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="700">Baterai</text>
      <text x="186" y="82" textAnchor="middle" fill="#334155" fontSize="14">Lampu indikator</text>
      <text x="181" y="390" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="700">Sampel larutan</text>
      <text x="181" y="166" textAnchor="middle" fill="#475569" fontSize="13">Elektroda</text>
    </svg>
    <figcaption style={{ color: 'var(--slate-600)', fontSize: '0.86rem', lineHeight: 1.65 }}>
      Gunakan kit uji berbaterai bertegangan rendah yang disiapkan atau diperiksa guru. Skema ini hanya ilustrasi, bukan panduan merakit rangkaian.
    </figcaption>
  </figure>
);

const MiniLabCheck = () => {
  const [answer, setAnswer] = React.useState<string | null>(null);
  const choices = ['Air garam', 'Air gula', 'Air suling'];

  return (
    <div style={{ ...cardStyle, backgroundColor: 'var(--navy-900)', color: '#ffffff', borderRadius: '8px' }}>
      <p style={{ color: '#99f6e4', fontWeight: 800, marginBottom: '0.5rem' }}>Cek prediksi</p>
      <p style={{ color: '#ffffff', lineHeight: 1.7, marginBottom: '1rem' }}>
        Sampel mana yang kamu perkirakan menghasilkan ion bergerak paling banyak pada konsentrasi yang setara?
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            aria-pressed={answer === choice}
            onClick={() => setAnswer(choice)}
            style={{
              padding: '0.65rem 0.9rem',
              borderRadius: '6px',
              border: answer === choice ? '2px solid #5eead4' : '1px solid #64748b',
              background: answer === choice ? '#134e4a' : '#1e293b',
              color: '#ffffff',
              font: 'inherit',
              cursor: 'pointer',
            }}
          >
            {choice}
          </button>
        ))}
      </div>
      {answer && (
        <p role="status" style={{ color: '#e2e8f0', lineHeight: 1.7, marginTop: '1rem', marginBottom: 0 }}>
          {answer === 'Air garam'
            ? 'Tepat. Garam yang larut menghasilkan ion Na⁺ dan Cl⁻ yang dapat bergerak. Buktikan dengan alat, lalu catat hasil pengamatanmu.'
            : 'Coba pikirkan lagi partikel yang terbentuk saat sampel larut. Gula tetap sebagai molekul netral, sedangkan air suling hanya memiliki sangat sedikit ion.'}
        </p>
      )}
    </div>
  );
};

const ApplicationVisual = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', margin: '1rem 0' }}>
    <div style={{ ...cardStyle, background: '#ecfeff', borderColor: '#a5f3fc', borderRadius: '8px', textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', padding: '0.7rem', borderRadius: '50%', color: '#0e7490', background: '#cffafe' }}><FlaskConical size={25} /></span>
      <h4 style={{ color: 'var(--navy-900)', margin: '0.5rem 0 0.2rem' }}>Cairan tubuh</h4>
      <p style={{ ...paragraph, fontSize: '0.85rem', margin: 0 }}>Ion membantu kerja saraf dan otot.</p>
    </div>
    <div style={{ ...cardStyle, background: '#f0fdf4', borderColor: '#bbf7d0', borderRadius: '8px', textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', padding: '0.7rem', borderRadius: '50%', color: '#15803d', background: '#dcfce7' }}><BookOpen size={25} /></span>
      <h4 style={{ color: 'var(--navy-900)', margin: '0.5rem 0 0.2rem' }}>Larutan rehidrasi</h4>
      <p style={{ ...paragraph, fontSize: '0.85rem', margin: 0 }}>Mengandung air dan ion terlarut dengan takaran tertentu.</p>
    </div>
    <div style={{ ...cardStyle, background: '#fff7ed', borderColor: '#fed7aa', borderRadius: '8px', textAlign: 'center' }}>
      <span style={{ display: 'inline-flex', padding: '0.7rem', borderRadius: '50%', color: '#c2410c', background: '#ffedd5' }}><FlaskConical size={25} /></span>
      <h4 style={{ color: 'var(--navy-900)', margin: '0.5rem 0 0.2rem' }}>Aki timbal-asam</h4>
      <p style={{ ...paragraph, fontSize: '0.85rem', margin: 0 }}>Elektrolitnya membantu berlangsungnya reaksi kimia.</p>
    </div>
  </div>
);

const MiniLabWorksheet = () => {
  const samples = ['Air suling', 'Air keran', 'Larutan garam', 'Larutan gula', 'Cuka encer'];
  const prompts = [
    { title: '1. Prediksi sebelum uji', detail: 'Menghantarkan atau tidak? Apa alasanmu?' },
    { title: '2. Hasil pengamatan', detail: 'Bagaimana indikator lampu dan gelembung?' },
    { title: '3. Bandingkan', detail: 'Sesuai atau berbeda dari prediksi? Mengapa?' },
  ];

  return (
    <div style={{ margin: '1rem 0 1.5rem' }}>
      <h4 style={{ color: 'var(--navy-900)', fontSize: '0.98rem', marginBottom: '0.75rem' }}>
        Format catatan — salin ke lembar kerja atau buku
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))', gap: '0.8rem' }}>
        {samples.map((sample, index) => (
          <article
            key={sample}
            style={{
              padding: '1rem',
              border: '1px solid var(--slate-200)',
              borderTop: '3px solid var(--teal-600)',
              borderRadius: '8px',
              background: '#ffffff',
            }}
          >
            <h5 style={{ color: 'var(--navy-900)', fontSize: '0.96rem', margin: '0 0 0.75rem' }}>
              Sampel {index + 1}: {sample}
            </h5>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {prompts.map((prompt) => (
                <div key={prompt.title} style={{ padding: '0.6rem', background: 'var(--slate-50)', borderRadius: '6px' }}>
                  <strong style={{ display: 'block', color: 'var(--teal-800)', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                    {prompt.title}
                  </strong>
                  <span style={{ color: 'var(--slate-600)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    {prompt.detail}
                  </span>
                  <div aria-hidden="true" style={{ height: '0.65rem', borderBottom: '1px dashed var(--slate-300)' }} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const modules: ModuleItem[] = [
  {
    id: 'modul-1',
    title: 'Modul 1: Pengantar & Konsep Dasar Daya Hantar Listrik Larutan',
    objectives: [
      'Menjelaskan definisi larutan dan perbedaannya dengan campuran biasa.',
      'Membedakan larutan elektrolit dan non-elektrolit berdasarkan kemampuan menghantarkan listrik.',
      'Memahami gejala nyala lampu dan gelembung gas pada larutan.',
    ],
    content: (
      <>
        <h3 style={subTitle}>Uraian Materi</h3>
        <p style={paragraph}>Larutan adalah campuran homogen yang terdiri atas zat terlarut dan pelarut. Ketika zat terlarut dilarutkan dalam air, partikel zat tersebut dapat tersebar merata. Namun, tidak semua larutan memiliki kemampuan yang sama untuk menghantarkan arus listrik.</p>
        <p style={paragraph}>Larutan elektrolit adalah larutan yang dapat menghantarkan listrik karena mengandung ion-ion yang bergerak bebas. Sementara larutan non-elektrolit tidak menghantarkan listrik karena zat terlarutnya tidak membentuk ion ketika dilarutkan dalam air.</p>

        <ParticleVisual />

        <h3 style={subTitle}>Perbedaan Elektrolit dan Non-Elektrolit</h3>
        <DataTable
          headers={['Ciri', 'Larutan Elektrolit', 'Larutan Non-Elektrolit']}
          rows={[
            ['Kemampuan menghantarkan listrik', 'Ya', 'Tidak'],
            ['Bentuk partikel dalam air', 'Ion bergerak bebas', 'Molekul netral'],
            ['Nyala lampu', 'Menyala terang atau redup', 'Tidak menyala'],
            ['Gelembung gas', 'Umumnya ada', 'Tidak ada'],
            ['Contoh', 'NaCl, HCl, NaOH', 'Gula, urea, etanol'],
          ]}
        />

        <h3 style={subTitle}>Gejala dalam Uji Larutan</h3>
        <ul style={listStyle}>
          <li>Larutan elektrolit kuat biasanya menyalakan lampu terang dan menghasilkan banyak gelembung gas.</li>
          <li>Larutan elektrolit lemah biasanya menyalakan lampu redup atau kadang tidak menyala, serta menghasilkan sedikit gelembung gas.</li>
          <li>Larutan non-elektrolit tidak menyalakan lampu dan tidak menghasilkan gelembung gas.</li>
        </ul>

        <InfoBox title="Pojok Info / Fun Fact">
          Di dalam tubuh manusia, ion seperti Na⁺, K⁺, dan Cl⁻ sangat penting untuk menjaga keseimbangan cairan dan fungsi saraf. Tanpa ion, sel-sel tubuh tidak bisa bekerja dengan baik.
        </InfoBox>

        <h3 style={subTitle}>Sejarah Singkat: Teori Ionisasi Svante Arrhenius</h3>
        <p style={paragraph}>Svante Arrhenius adalah ilmuwan Swedia yang memperkenalkan teori ionisasi pada akhir abad ke-19. Menurut teorinya, zat elektrolit dapat terurai menjadi ion ketika dilarutkan dalam air. Keberadaan ion inilah yang memungkinkan larutan menghantarkan listrik.</p>
        <div style={equationStyle}>NaCl(s) → Na⁺(aq) + Cl⁻(aq)</div>

        <InfoBox title="Poin penting" color="green">
          Arus listrik dapat mengalir dalam larutan jika ada ion yang bergerak bebas. Itulah sebabnya larutan elektrolit dapat menghantarkan listrik, sementara larutan non-elektrolit tidak.
        </InfoBox>
      </>
    ),
  },
  {
    id: 'modul-2',
    title: 'Modul 2: Klasifikasi Larutan Elektrolit (Kuat vs Lemah)',
    objectives: [
      'Membedakan elektrolit kuat, elektrolit lemah, dan non-elektrolit.',
      'Memahami konsep derajat ionisasi α.',
      'Menuliskan persamaan ionisasi lengkap dan sebagian dengan benar.',
    ],
    content: (
      <>
        <h3 style={subTitle}>Uraian Materi</h3>
        <p style={paragraph}>Larutan elektrolit dibedakan menjadi elektrolit kuat dan elektrolit lemah berdasarkan seberapa besar jumlah zat yang berubah menjadi ion saat dilarutkan dalam air. Perbedaan ini terlihat dari jumlah ion yang terbentuk, daya hantar listrik, dan gejala pada lampu serta gelembung gas.</p>

        <DataTable
          headers={['Jenis Larutan', 'Ionisasi', 'Daya Hantar Listrik', 'Contoh']}
          rows={[
            ['Elektrolit kuat', 'Hampir sempurna', 'Tinggi', 'HCl, NaCl, NaOH'],
            ['Elektrolit lemah', 'Sebagian', 'Rendah', 'CH₃COOH, NH₃'],
            ['Non-elektrolit', 'Tidak membentuk ion', 'Tidak berarti', 'Gula, urea, etanol'],
          ]}
        />

        <h3 style={subTitle}>Derajat Ionisasi (α)</h3>
        <p style={paragraph}>Derajat ionisasi adalah perbandingan jumlah mol zat yang terionisasi dengan jumlah mol zat mula-mula. Simbolnya adalah α.</p>
        <div style={equationStyle}>α = jumlah mol zat yang terionisasi / jumlah mol zat mula-mula</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ ...cardStyle, backgroundColor: 'var(--teal-50)', borderColor: 'var(--teal-200)' }}>
            <h3 style={{ color: 'var(--teal-700)' }}>Elektrolit kuat</h3>
            <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>α ≈ 1</h2>
            <p style={paragraph}>Ionisasi hampir sempurna.</p>
          </div>
          <div style={{ ...cardStyle, backgroundColor: 'var(--weak-bg)', borderColor: 'var(--weak-border)' }}>
            <h3 style={{ color: 'var(--weak-text)' }}>Elektrolit lemah</h3>
            <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>0 &lt; α &lt; 1</h2>
            <p style={paragraph}>Ionisasi hanya sebagian.</p>
          </div>
          <div style={{ ...cardStyle, backgroundColor: 'var(--slate-50)', borderColor: 'var(--slate-200)' }}>
            <h3 style={{ color: 'var(--slate-700)' }}>Non-elektrolit</h3>
            <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>α = 0</h2>
            <p style={paragraph}>Tidak terjadi ionisasi.</p>
          </div>
        </div>

        <h3 style={subTitle}>Persamaan Reaksi Ionisasi</h3>
        <InfoBox title="Elektrolit kuat: ionisasi lengkap">
          <div style={equationStyle}>HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)</div>
          <div style={equationStyle}>NaCl(s) → Na⁺(aq) + Cl⁻(aq)</div>
        </InfoBox>

        <InfoBox title="Elektrolit lemah: ionisasi sebagian" color="orange">
          <div style={equationStyle}>CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)</div>
          <div style={equationStyle}>NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)</div>
        </InfoBox>

        <h3 style={subTitle}>Contoh Aplikasi Derajat Ionisasi</h3>
        <p style={paragraph}>Jika 0,4 mol asam asetat dilarutkan dalam air dan 0,08 mol berubah menjadi ion, maka derajat ionisasinya adalah:</p>
        <div style={equationStyle}>α = 0,08 / 0,4 = 0,2 = 20%</div>
        <p style={paragraph}>Artinya, hanya 20% molekul yang terionisasi. Jadi, asam asetat termasuk elektrolit lemah.</p>
      </>
    ),
  },
  {
    id: 'modul-3',
    title: 'Modul 3: Jenis Ikatan Kimia dan Sifat Elektrolit',
    objectives: [
      'Menghubungkan jenis ikatan dengan kemampuan menghantarkan listrik.',
      'Membedakan sifat elektrolit dalam bentuk padatan, lelehan, dan larutan.',
      'Mengidentifikasi contoh senyawa ionik dan kovalen polar sehari-hari.',
    ],
    content: (
      <>
        <h3 style={subTitle}>Uraian Materi</h3>
        <p style={paragraph}>Jenis ikatan kimia memengaruhi kemampuan suatu zat menghantarkan listrik. Senyawa ionik, seperti NaCl, dapat menghantarkan listrik dalam bentuk lelehan dan larutan, tetapi tidak dalam bentuk padat. Senyawa kovalen polar, seperti HCl, dapat membentuk ion dalam air dan menjadi larutan elektrolit.</p>

        <DataTable
          headers={['Senyawa', 'Dalam padat', 'Dalam lelehan', 'Dalam larutan']}
          rows={[
            ['Senyawa ionik', 'Tidak menghantarkan', 'Menghantarkan', 'Menghantarkan'],
            ['Senyawa kovalen polar', 'Tidak menghantarkan', 'Umumnya tidak menghantarkan', 'Bisa menghantarkan jika terionisasi'],
            ['Senyawa kovalen nonpolar', 'Tidak menghantarkan', 'Tidak menghantarkan', 'Tidak menghantarkan'],
          ]}
        />

        <h3 style={subTitle}>Senyawa Ionik</h3>
        <p style={paragraph}>Senyawa ionik tersusun atas ion positif dan ion negatif yang terikat dalam kisi kristal. Dalam bentuk padat, ion-ion tersebut tidak dapat bergerak bebas. Ketika senyawa tersebut dilelehkan atau dilarutkan dalam air, ion-ion dapat bergerak dan menghantarkan listrik.</p>
        <div style={equationStyle}>NaCl(s) → Na⁺(aq) + Cl⁻(aq)</div>

        <h3 style={subTitle}>Senyawa Kovalen Polar</h3>
        <p style={paragraph}>Senyawa kovalen polar memiliki perbedaan keelektronegatifan yang cukup besar. Beberapa di antaranya, seperti HCl dan CH₃COOH, dapat bereaksi dengan air membentuk ion. Karena itu, larutan mereka dapat menghantarkan listrik.</p>

        <h3 style={subTitle}>Contoh dalam Kehidupan Sehari-hari</h3>
        <ul style={listStyle}>
          <li>NaCl (garam dapur): elektrolit dalam larutan, penting untuk menjaga keseimbangan ion dalam tubuh.</li>
          <li>HCl: asam kuat yang banyak digunakan di laboratorium dan industri.</li>
          <li>CH₃COOH (asam asetat): terdapat dalam cuka dapur, termasuk elektrolit lemah.</li>
          <li>NH₃ (amonia): basa lemah yang membentuk ion dalam air.</li>
        </ul>

        <InfoBox title="Pojok Info / Fun Fact">
          Air laut dan cairan tubuh manusia mengandung ion yang dapat membawa muatan listrik. Itulah alasan cairan tubuh dapat berperan dalam proses saraf dan kontraksi otot.
        </InfoBox>
      </>
    ),
  },
  {
    id: 'modul-4',
    title: 'Modul 4: Praktikum Mini Menguji Daya Hantar',
    objectives: [
      'Membuat prediksi tentang kemampuan beberapa larutan menghantarkan listrik.',
      'Mengamati indikator alat uji dan mencatat hasil secara sistematis.',
      'Menjelaskan hasil pengamatan berdasarkan keberadaan ion bergerak.',
    ],
    content: (
      <>
        <h3 style={subTitle}>Pertanyaan penyelidikan</h3>
        <InfoBox title="Bagaimana keberadaan ion memengaruhi hasil uji?">
          Bandingkan air suling, air keran, larutan garam, larutan gula, dan cuka yang telah diencerkan oleh guru. Sebelum menguji, tulis dugaanmu dan alasan berdasarkan model partikel yang sudah dipelajari.
        </InfoBox>
        <CircuitVisual />
        <MiniLabCheck />

        <h3 style={subTitle}>Tugas dan catatan siswa</h3>
        <InfoBox title="Kerjakan di lembar kerja atau buku catatan">
          Untuk setiap sampel, isi catatan secara berurutan: tulis prediksi dan alasannya sebelum uji, catat hasil pengamatan setelah uji, lalu bandingkan apakah hasilnya sesuai atau berbeda dari prediksi. Salin format kartu berikut ke lembar kerja atau buku catatan. Tombol “Cek prediksi” hanya latihan awal dan tidak menggantikan catatan tertulis.
        </InfoBox>
        <MiniLabWorksheet />
        <InfoBox title="Contoh dan kesimpulan">
          Contoh prediksi: “Saya memperkirakan larutan garam menghantarkan listrik karena garam terurai menjadi ion yang dapat bergerak.” Setelah semua sampel diuji, tulis kesimpulan singkat: “Sampel yang paling baik menghantarkan listrik adalah …, ditunjukkan oleh …, karena ….” Kesimpulan harus berdasarkan hasil pengamatan, bukan hanya prediksi.
        </InfoBox>

        <h3 style={subTitle}>Alat dan sampel</h3>
        <ul style={listStyle}>
          <li>Kit uji daya hantar bertegangan rendah yang disiapkan atau diperiksa oleh guru.</li>
          <li>Gelas bening berlabel, batang pengaduk bersih, tisu, dan lembar pencatatan.</li>
          <li>Air suling, air keran, larutan garam, larutan gula, serta cuka encer yang disiapkan guru.</li>
        </ul>
        <h3 style={subTitle}>Langkah pengamatan</h3>
        <ol style={listStyle}>
          <li>Siapkan lembar kerja atau buku catatan, lalu isi kolom prediksi dan alasan untuk semua sampel sebelum mulai menguji.</li>
          <li>Dengan arahan guru, uji satu sampel pada satu waktu menggunakan kit yang sudah disiapkan.</li>
          <li>Catat hasil lampu/indikator dan ada atau tidaknya gelembung pada tabel segera setelah mengamati.</li>
          <li>Bilas elektroda dengan air suling dan keringkan sebelum berpindah sampel.</li>
          <li>Setelah semua sampel diuji, bandingkan prediksi dengan hasil pengamatan pada baris yang sama. Tulis “sesuai” atau “berbeda” di kolom perbandingan dan berikan alasan berdasarkan indikator lampu/gelembung yang dicatat.</li>
          <li>Tulis kesimpulan akhir di bawah tabel dengan menghubungkan hasil pengamatan dan keberadaan ion bergerak.</li>
        </ol>

        <InfoBox title="Setelah langkah ke-6: lengkapi catatan di kertas">
          Bagian ini bukan formulir baru yang harus diisi di layar. Gunakan lembar kerja dari guru atau buku catatan, lalu pastikan:
          <ol style={{ ...listStyle, marginTop: '0.5rem' }}>
            <li>Untuk setiap sampel, sudah ada prediksi, hasil pengamatan lampu/gelembung, dan keterangan apakah hasilnya sesuai atau berbeda dari prediksi.</li>
            <li>Di bawah catatan sampel, tulis kesimpulan singkat dengan alasan berdasarkan hasil pengamatan dan keberadaan ion.</li>
          </ol>
          Siapkan catatan tersebut untuk dibahas atau diperiksa sesuai arahan guru.
        </InfoBox>

        <InfoBox title="Variabel yang perlu dijaga" color="green">
          Gunakan prosedur, volume sampel, kedalaman elektroda, dan alat yang sama. Konsentrasi memengaruhi hasil, jadi perbandingan hanya adil jika sampelnya disiapkan dengan ketentuan yang setara.
        </InfoBox>
        <InfoBox title="Keselamatan praktikum" color="orange">
          Jangan pernah menghubungkan larutan ke listrik stopkontak. Gunakan hanya kit baterai bertegangan rendah, jangan mencicipi sampel, hindari kontak sampel dengan mata, dan ikuti arahan guru. Cuka yang digunakan harus encer dan disiapkan guru.
        </InfoBox>
        <p style={paragraph}>
          Nyala lampu dan gelembung adalah petunjuk pengamatan, bukan ukuran pasti jumlah ion. Hasil dapat dipengaruhi konsentrasi, kondisi elektroda, dan kepekaan alat; karena itu, simpulkan dengan mempertimbangkan semua data.
        </p>
      </>
    ),
  },
  {
    id: 'modul-5',
    title: 'Modul 5: Elektrolit di Kehidupan Sehari-hari',
    objectives: [
      'Menghubungkan konsep ion dengan beberapa contoh di sekitar kita.',
      'Menjelaskan fungsi elektrolit tanpa menyamakan semua produk elektrolit.',
      'Merangkum hubungan partikel, daya hantar, dan penerapannya.',
    ],
    content: (
      <>
        <h3 style={subTitle}>Dari konsep ke konteks nyata</h3>
        <p style={paragraph}>
          Ion bergerak tidak hanya penting dalam percobaan kimia. Ion terlarut berperan dalam proses tubuh, larutan rehidrasi, dan reaksi elektrokimia di aki. Contoh-contoh ini memiliki fungsi dan komposisi berbeda, jadi istilah “mengandung elektrolit” tidak berarti semuanya bekerja dengan cara yang sama.
        </p>
        <ApplicationVisual />
        <DataTable
          headers={['Konteks', 'Kaitan dengan ion', 'Pertanyaan untuk dipikirkan']}
          rows={[
            ['Cairan tubuh', 'Ion seperti Na⁺, K⁺, dan Cl⁻ berperan dalam keseimbangan cairan serta fungsi saraf dan otot.', 'Mengapa perpindahan ion penting bagi sel?'],
            ['Larutan rehidrasi', 'Mengandung air dan zat terlarut dengan komposisi tertentu untuk membantu mengganti cairan dan elektrolit.', 'Mengapa komposisi dan takaran harus sesuai petunjuk?'],
            ['Aki timbal-asam', 'Larutan asam sulfat menjadi bagian dari reaksi elektrokimia yang menghasilkan energi listrik.', 'Apa perbedaan fungsi elektrolit di aki dan di tubuh?'],
          ]}
        />
        <InfoBox title="Rangkuman inti" color="green">
          Daya hantar larutan berkaitan dengan keberadaan ion yang dapat bergerak. Jenis zat dan interaksinya dengan air menentukan partikel yang terbentuk; jumlah ion dan kondisi pengukuran turut memengaruhi hasil percobaan.
        </InfoBox>
        <h3 style={subTitle}>Tantangan akhir</h3>
        <p style={paragraph}>
          Pilih satu contoh penggunaan elektrolit di rumah atau lingkunganmu. Gambarkan partikel yang berperan, jelaskan fungsi ionnya, lalu sebutkan informasi apa yang masih perlu dicari agar penjelasanmu lebih lengkap.
        </p>
      </>
    ),
  },
];

export const Materi: React.FC<MateriProps> = ({ onStartLab }) => {
  const [activeModule, setActiveModule] = React.useState<string>(modules[0].id);
  const activeModuleIndex = Math.max(0, modules.findIndex((module) => module.id === activeModule));
  const selectedModule = modules[activeModuleIndex];

  const renderModuleSection = (module: ModuleItem) => (
    <section
      id={module.id}
      role="tabpanel"
      aria-labelledby={`tab-${module.id}`}
      className="card"
      style={{
        padding: 'clamp(1rem, 3vw, 2rem)',
        border: '1px solid var(--slate-200)',
        boxShadow: '0 8px 26px rgba(15, 23, 42, 0.05)',
        background: '#ffffff',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FlaskConical size={18} color="var(--teal-600)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {module.id.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <h2 style={{ ...sectionTitle, marginTop: 0 }}>{module.title}</h2>
      <div style={{ ...cardStyle, background: 'var(--teal-50)', borderColor: 'var(--teal-100)', borderRadius: '6px', margin: '1rem 0 1.5rem' }}>
        <h3 style={{ ...subTitle, marginTop: 0 }}>Tujuan Pembelajaran</h3>
        <ul style={listStyle}>
          {module.objectives.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {module.content}
    </section>
  );

  return (
    <div className="lab-grid-pattern" style={{ minHeight: '100vh', padding: '2.5rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'var(--teal-50)',
              border: '1px solid var(--teal-200)',
              color: 'var(--teal-800)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <BookOpen size={15} />
            Kurikulum Merdeka Fase E
          </div>

          <h1 style={{ fontSize: '2rem', lineHeight: 1.2, fontWeight: 900, color: 'var(--navy-950)', letterSpacing: '0', marginBottom: '0.75rem' }}>
            Larutan Elektrolit dan Non-Elektrolit
          </h1>

          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '760px', margin: '0 auto' }}>
            Materi pembelajaran Kimia SMA Kelas X yang membantu siswa memahami konsep larutan, ionisasi, dan aplikasi elektrolit dalam kehidupan sehari-hari.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <div role="tablist" aria-label="Pilih modul pembelajaran" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.55rem' }}>
            {modules.map((module, index) => {
              const isSelected = index === activeModuleIndex;
              return (
                <button
                  key={module.id}
                  id={`tab-${module.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={module.id}
                  onClick={() => setActiveModule(module.id)}
                  style={{
                    minHeight: '68px',
                    padding: '0.7rem 0.85rem',
                    border: isSelected ? '1px solid var(--teal-700)' : '1px solid var(--slate-200)',
                    borderRadius: '6px',
                    background: isSelected ? 'var(--teal-50)' : '#ffffff',
                    color: isSelected ? 'var(--teal-900)' : 'var(--slate-700)',
                    textAlign: 'left',
                    font: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Modul {index + 1}</span>
                  <span style={{ display: 'block', fontSize: '0.82rem', lineHeight: 1.35, fontWeight: 650 }}>{module.title.replace(/^Modul \d+:\s*/, '')}</span>
                </button>
              );
            })}
          </div>

          <div aria-label={`Progres modul ${activeModuleIndex + 1} dari ${modules.length}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ height: '5px', flex: 1, overflow: 'hidden', borderRadius: '999px', background: 'var(--slate-200)' }}>
              <div style={{ width: `${((activeModuleIndex + 1) / modules.length) * 100}%`, height: '100%', background: 'var(--teal-600)', transition: 'width 180ms ease' }} />
            </div>
            <span style={{ color: 'var(--slate-600)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>Modul {activeModuleIndex + 1} dari {modules.length}</span>
          </div>
        </div>

        {renderModuleSection(selectedModule)}

        <nav aria-label="Navigasi modul" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1rem', width: '100%', minWidth: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ minWidth: 0, maxWidth: '48%', flex: '1 1 0', padding: '0.65rem 0.75rem', fontSize: '0.85rem', whiteSpace: 'normal', textAlign: 'center' }}
            disabled={activeModuleIndex === 0}
            onClick={() => setActiveModule(modules[activeModuleIndex - 1].id)}
          >
            Modul sebelumnya
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ minWidth: 0, maxWidth: '48%', flex: '1 1 0', padding: '0.65rem 0.75rem', fontSize: '0.85rem', whiteSpace: 'normal', textAlign: 'center' }}
            disabled={activeModuleIndex === modules.length - 1}
            onClick={() => setActiveModule(modules[activeModuleIndex + 1].id)}
          >
            Modul berikutnya <ArrowRight size={17} />
          </button>
        </nav>

        <ReferenceList />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            border: '1px solid var(--slate-200)',
            padding: '1.5rem 2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy-900)' }}>Siap mengeksplorasi lebih lanjut?</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
              Uji pemahamanmu melalui eksperimen dan observasi di laboratorium virtual.
            </p>
          </div>

          <button onClick={onStartLab} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', maxWidth: '100%', whiteSpace: 'normal', textAlign: 'center' }}>
            <span>Buka Laboratorium Virtual</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
