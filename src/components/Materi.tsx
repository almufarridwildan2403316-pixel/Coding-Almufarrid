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
  letterSpacing: '-0.02em',
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
  backgroundColor: 'var(--slate-900)',
  color: '#ffffff',
  padding: '1rem 1.1rem',
  borderRadius: '10px',
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 700,
  fontFamily: 'monospace',
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
    title: 'Modul 4: Aplikasi dalam Kehidupan Sehari-hari',
    objectives: [
      'Menjelaskan peran elektrolit dalam tubuh manusia dan produk sehari-hari.',
      'Mengaitkan konsep elektrolit dengan kesehatan, teknologi, dan industri.',
      'Memahami manfaat elektrolit dalam kehidupan nyata.',
    ],
    content: (
      <>
        <h3 style={subTitle}>Uraian Materi</h3>
        <p style={paragraph}>Konsep larutan elektrolit tidak hanya dipelajari di kelas, tetapi juga sangat dekat dengan kehidupan sehari-hari. Elektrolit berperan dalam kesehatan, teknologi, dan berbagai proses industri.</p>

        <h3 style={subTitle}>Aplikasi Elektrolit dalam Kehidupan</h3>
        <ul style={listStyle}>
          <li><strong>Dalam tubuh manusia:</strong> ion Na⁺, K⁺, Ca²⁺, dan Cl⁻ membantu menjaga cairan tubuh, kerja otot, dan impuls saraf.</li>
          <li><strong>Cairan infus:</strong> dibuat dengan konsentrasi ion yang tepat agar aman dan isotonik dengan darah.</li>
          <li><strong>Minuman isotonik:</strong> mengandung elektrolit untuk menggantikan cairan dan mineral yang hilang saat berolahraga.</li>
          <li><strong>Aki kendaraan:</strong> menggunakan asam sulfat sebagai elektrolit untuk menghasilkan arus listrik.</li>
          <li><strong>Industri kimia:</strong> elektrolit digunakan dalam proses elektrolisis dan pembuatan logam.</li>
        </ul>

        <InfoBox title="Pojok Info / Fun Fact">
          Aki mobil bekerja karena larutan elektrolit di dalamnya dapat menghantarkan arus listrik dan memicu reaksi kimia. Tanpa elektrolit, aki tidak akan bisa menghasilkan energi listrik.
        </InfoBox>

        <h3 style={subTitle}>Rangkuman Materi</h3>
        <ul style={listStyle}>
          <li>Larutan elektrolit dapat menghantarkan listrik karena mengandung ion yang bergerak bebas.</li>
          <li>Larutan non-elektrolit tidak dapat menghantarkan listrik karena tidak membentuk ion.</li>
          <li>Elektrolit kuat memiliki ionisasi hampir sempurna, sementara elektrolit lemah mengalami ionisasi sebagian.</li>
          <li>Jenis ikatan dan bentuk zat memengaruhi kemampuan menghantarkan listrik.</li>
          <li>Elektrolit sangat penting dalam tubuh manusia, cairan infus, minuman isotonik, serta aki kendaraan.</li>
        </ul>

      </>
    ),
  },
];

export const Materi: React.FC<MateriProps> = ({ onStartLab }) => {
  const [activeModule, setActiveModule] = React.useState<string>(modules[0].id);

  const renderModuleSection = (module: ModuleItem, isActive: boolean) => (
    <section
      key={module.id}
      id={module.id}
      className="card"
      style={{
        padding: 'clamp(1rem, 3vw, 2rem)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: isActive ? '1px solid var(--teal-300)' : '1px solid var(--slate-200)',
        boxShadow: isActive ? '0 12px 30px rgba(15, 118, 110, 0.08)' : 'none',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fffe 100%)',
        borderRadius: '18px',
      }}
      onClick={() => setActiveModule(isActive ? '' : module.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FlaskConical size={18} color="var(--teal-600)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {module.id.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)' }}>
          {isActive ? 'Tutup' : 'Buka'}
        </span>
      </div>

      <h2 style={{ ...sectionTitle, marginTop: '1rem' }}>{module.title}</h2>

      {!isActive ? (
        <p style={{ ...paragraph, marginBottom: 0, color: 'var(--slate-500)' }}>
          Klik untuk membuka materi modul ini.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '1.2rem' }}>
            <h3 style={subTitle}>Tujuan Pembelajaran</h3>
            <ul style={listStyle}>
              {module.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {module.content}
        </>
      )}
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

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--navy-950)', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            Larutan Elektrolit dan Non-Elektrolit
          </h1>

          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '760px', margin: '0 auto' }}>
            Materi pembelajaran Kimia SMA Kelas X yang membantu siswa memahami konsep larutan, ionisasi, dan aplikasi elektrolit dalam kehidupan sehari-hari.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {modules.map((module) => renderModuleSection(module, activeModule === module.id))}
        </div>

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

          <button onClick={onStartLab} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
            <span>Buka Laboratorium Virtual</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
