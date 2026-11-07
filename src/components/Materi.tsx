import React, { useState } from 'react';
import { BookOpen, Zap, ArrowRight, FlaskConical, Lightbulb } from 'lucide-react';

interface MateriProps {
  onStartLab: () => void;
}

type TabType =
  | 'dasar'
  | 'kuat'
  | 'lemah'
  | 'non'
  | 'perbandingan'
  | 'arrhenius';

export const Materi: React.FC<MateriProps> = ({ onStartLab }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dasar');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'dasar', label: '1. Konsep Dasar' },
    { id: 'kuat', label: '2. Elektrolit Kuat' },
    { id: 'lemah', label: '3. Elektrolit Lemah' },
    { id: 'non', label: '4. Non-Elektrolit' },
    { id: 'perbandingan', label: '5. Perbandingan' },
    { id: 'arrhenius', label: '6. Teori Arrhenius' },
  ];

  const sectionTitle: React.CSSProperties = {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--navy-900)',
    marginBottom: '1rem',
  };

  const paragraph: React.CSSProperties = {
    fontSize: '0.96rem',
    color: 'var(--slate-700)',
    lineHeight: 1.85,
    marginBottom: '1rem',
    textAlign: 'justify',
  };

  const subTitle: React.CSSProperties = {
    fontSize: '1.08rem',
    fontWeight: 750,
    color: 'var(--navy-900)',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
  };

  const cardStyle: React.CSSProperties = {
    padding: '1.35rem',
    borderRadius: '12px',
    margin: '1.2rem 0',
    border: '1px solid var(--slate-200)',
  };

  const listStyle: React.CSSProperties = {
    paddingLeft: '1.35rem',
    color: 'var(--slate-700)',
    fontSize: '0.94rem',
    lineHeight: 2,
  };

  const equationStyle: React.CSSProperties = {
    backgroundColor: 'var(--slate-900)',
    color: '#ffffff',
    padding: '1.25rem',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '1.05rem',
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
      <div style={{
        ...cardStyle,
        backgroundColor: backgrounds[color],
        borderLeft: `4px solid ${borders[color]}`,
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: 750,
          color: 'var(--navy-900)',
          marginBottom: '0.6rem',
        }}>
          {title}
        </h4>
        <div style={{
          fontSize: '0.93rem',
          lineHeight: 1.8,
          color: 'var(--slate-700)',
        }}>
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
          <tr style={{
            backgroundColor: 'var(--slate-900)',
            color: '#ffffff',
          }}>
            {headers.map((header, i) => (
              <th key={i} style={{
                padding: '13px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#ffffff',
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j} style={{
                  ...cellStyle,
                  backgroundColor: i % 2 === 0
                    ? '#ffffff'
                    : 'var(--slate-50)',
                }}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="lab-grid-pattern" style={{
      minHeight: '100vh',
      padding: '2.5rem 0 4rem 0',
    }}>
      <div className="container">

        {/* HEADER */}
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
            marginBottom: '0.75rem',
          }}>
            <BookOpen size={15} />
            Materi Pembelajaran Kimia SMA Kelas X
          </div>

          <h1 style={{
            fontSize: '2.3rem',
            fontWeight: 800,
            color: 'var(--navy-950)',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}>
            Larutan Elektrolit & Non-Elektrolit
          </h1>

          <p style={{
            color: 'var(--slate-600)',
            fontSize: '1rem',
            maxWidth: '780px',
            lineHeight: 1.8,
          }}>
            Pelajari pengertian, karakteristik, proses pembentukan ion,
            dan perbedaan larutan elektrolit kuat, elektrolit lemah,
            serta non-elektrolit melalui materi berikut.
          </p>
        </div>

        {/* NAVIGASI TAB */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          borderBottom: '1px solid var(--slate-200)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.8rem 1.1rem',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab.id
                  ? '#ffffff'
                  : 'transparent',
                borderBottom: activeTab === tab.id
                  ? '3px solid var(--teal-600)'
                  : '3px solid transparent',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id
                  ? 'var(--teal-800)'
                  : 'var(--slate-600)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ISI MATERI */}
        <div className="card" style={{
          padding: 'clamp(1rem, 4vw, 2.5rem)',
          marginBottom: '2.5rem',
        }}>

          {/* TAB 1: KONSEP DASAR */}
          {activeTab === 'dasar' && (
            <div>
              <h2 style={sectionTitle}>
                1. Konsep Dasar Larutan Elektrolit dan Non-Elektrolit
              </h2>

              <p style={paragraph}>
                Larutan merupakan campuran homogen yang terdiri atas
                zat terlarut dan pelarut. Berdasarkan kemampuan
                menghantarkan arus listrik, larutan dibedakan menjadi
                larutan elektrolit dan larutan non-elektrolit.
                Perbedaan tersebut berkaitan dengan keberadaan
                partikel bermuatan atau ion di dalam larutan.
              </p>

              <h3 style={subTitle}>A. Pengertian Larutan Elektrolit</h3>

              <p style={paragraph}>
                Larutan elektrolit adalah larutan yang dapat
                menghantarkan arus listrik karena mengandung ion-ion
                yang dapat bergerak bebas. Ion-ion tersebut terbentuk
                ketika zat terlarut mengalami proses ionisasi atau
                disosiasi dalam pelarut, terutama air.
              </p>

              <h3 style={subTitle}>B. Pengertian Larutan Non-Elektrolit</h3>

              <p style={paragraph}>
                Larutan non-elektrolit adalah larutan yang tidak dapat
                menghantarkan arus listrik secara berarti karena zat
                terlarutnya tidak menghasilkan ion-ion bebas ketika
                dilarutkan dalam air. Zat tersebut tetap berada dalam
                bentuk molekul netral meskipun dapat larut dalam air.
              </p>

              <h3 style={subTitle}>C. Mengenal Ion dalam Larutan</h3>

              <p style={paragraph}>
                Ion merupakan atom atau kelompok atom yang memiliki
                muatan listrik akibat kehilangan atau menerima
                elektron. Ion dibedakan menjadi dua jenis, yaitu:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1rem',
              }}>
                <div style={{
                  ...cardStyle,
                  backgroundColor: 'var(--teal-50)',
                }}>
                  <h3 style={{ color: 'var(--teal-800)' }}>
                    Kation (+)
                  </h3>
                  <p style={paragraph}>
                    Kation adalah ion bermuatan positif yang terbentuk
                    karena atom kehilangan satu atau lebih elektron.
                  </p>
                  <strong>Contoh: Na⁺, K⁺, Ca²⁺, NH₄⁺.</strong>
                </div>

                <div style={{
                  ...cardStyle,
                  backgroundColor: 'var(--slate-50)',
                }}>
                  <h3 style={{ color: 'var(--navy-900)' }}>
                    Anion (-)
                  </h3>
                  <p style={paragraph}>
                    Anion adalah ion bermuatan negatif yang terbentuk
                    karena atom menerima satu atau lebih elektron.
                  </p>
                  <strong>Contoh: Cl⁻, OH⁻, SO₄²⁻, NO₃⁻.</strong>
                </div>
              </div>

              <h3 style={subTitle}>D. Mengapa Larutan Dapat Menghantarkan Listrik?</h3>

              <p style={paragraph}>
                Arus listrik merupakan aliran muatan listrik.
                Pada larutan elektrolit, muatan listrik dibawa oleh
                ion-ion yang bergerak bebas. Ketika elektroda
                dihubungkan dengan sumber tegangan dan dicelupkan
                ke dalam larutan, kation bergerak menuju katode,
                sedangkan anion bergerak menuju anode.
                Pergerakan ion tersebut memungkinkan arus listrik
                mengalir melalui larutan.
              </p>

              <InfoBox title="Syarat Larutan Dapat Menghantarkan Listrik">
                <ul style={listStyle}>
                  <li>Mengandung ion positif dan/atau ion negatif yang bergerak bebas.</li>
                  <li>Ion-ion dapat bergerak di dalam larutan.</li>
                  <li>Terdapat sumber tegangan yang menghasilkan beda potensial.</li>
                </ul>
              </InfoBox>

              <h3 style={subTitle}>E. Perbedaan Garam Padat dan Larutan Garam</h3>

              <p style={paragraph}>
                Kristal NaCl dalam keadaan padat tidak dapat
                menghantarkan listrik karena ion Na⁺ dan Cl⁻
                terikat pada posisi tertentu dalam kisi kristal.
                Namun, ketika NaCl dilarutkan dalam air, ion-ion
                tersebut terpisah dan dapat bergerak bebas.
                Oleh karena itu, larutan NaCl dapat menghantarkan
                arus listrik.
              </p>

              <div style={equationStyle}>
                NaCl(s) → Na⁺(aq) + Cl⁻(aq)
              </div>

              <InfoBox title="Hal yang Perlu Diingat" color="green">
                Tidak semua zat yang larut dalam air dapat
                menghantarkan listrik. Kemampuan menghantarkan
                listrik ditentukan oleh ada atau tidaknya ion
                yang bergerak bebas di dalam larutan.
              </InfoBox>
            </div>
          )}

          {/* TAB 2: ELEKTROLIT KUAT */}
          {activeTab === 'kuat' && (
            <div>
              <h2 style={sectionTitle}>
                2. Larutan Elektrolit Kuat
              </h2>

              <p style={paragraph}>
                Larutan elektrolit kuat adalah larutan yang zat
                terlarutnya terionisasi atau terdisosiasi hampir
                sempurna ketika dilarutkan dalam air. Proses tersebut
                menghasilkan ion-ion positif dan negatif dalam
                jumlah relatif besar sehingga larutan memiliki
                kemampuan menghantarkan arus listrik dengan baik.
              </p>

              <InfoBox title="Pengertian Penting" color="green">
                Elektrolit kuat memiliki derajat ionisasi atau
                disosiasi yang mendekati 1 (100%). Artinya,
                hampir seluruh zat terlarut yang dapat larut
                menghasilkan ion-ion dalam larutan.
              </InfoBox>

              <h3 style={subTitle}>A. Ciri-Ciri Elektrolit Kuat</h3>

              <ul style={listStyle}>
                <li>Menghasilkan ion-ion dalam jumlah relatif banyak.</li>
                <li>Mengalami ionisasi atau disosiasi hampir sempurna.</li>
                <li>Memiliki derajat ionisasi mendekati 1.</li>
                <li>Memiliki daya hantar listrik relatif tinggi.</li>
                <li>Lampu alat uji elektrolit umumnya menyala terang.</li>
                <li>Umumnya menghasilkan banyak gelembung gas pada elektroda saat elektrolisis.</li>
              </ul>

              <h3 style={subTitle}>B. Jenis dan Contoh Elektrolit Kuat</h3>

              <p style={paragraph}>
                Elektrolit kuat umumnya berasal dari asam kuat,
                basa kuat, dan garam ionik yang larut dalam air.
              </p>

              <DataTable
                headers={['Jenis', 'Contoh Senyawa', 'Nama Senyawa']}
                rows={[
                  ['Asam kuat', 'HCl', 'Asam klorida'],
                  ['Asam kuat', 'HNO₃', 'Asam nitrat'],
                  ['Asam kuat', 'HBr', 'Asam bromida'],
                  ['Asam kuat', 'HClO₄', 'Asam perklorat'],
                  ['Asam kuat', 'H₂SO₄', 'Asam sulfat'],
                  ['Basa kuat', 'NaOH', 'Natrium hidroksida'],
                  ['Basa kuat', 'KOH', 'Kalium hidroksida'],
                  ['Basa kuat', 'Ba(OH)₂', 'Barium hidroksida'],
                  ['Garam larut', 'NaCl', 'Natrium klorida'],
                  ['Garam larut', 'KCl', 'Kalium klorida'],
                ]}
              />

              <h3 style={subTitle}>C. Proses Pembentukan Ion</h3>

              <p style={paragraph}>
                Pada elektrolit kuat, proses pembentukan ion
                berlangsung hampir sempurna. Proses ini dapat
                berupa disosiasi senyawa ionik atau ionisasi
                senyawa molekuler.
              </p>

              <InfoBox title="1. Disosiasi Natrium Klorida (NaCl)">
                Natrium klorida merupakan senyawa ionik.
                Ketika dilarutkan dalam air, ion Na⁺ dan Cl⁻
                terpisah dari kisi kristalnya dan terhidrasi
                oleh molekul air.
                <div style={equationStyle}>
                  NaCl(s) → Na⁺(aq) + Cl⁻(aq)
                </div>
              </InfoBox>

              <InfoBox title="2. Ionisasi Asam Klorida (HCl)" color="green">
                HCl merupakan senyawa kovalen polar yang
                membentuk ion ketika bereaksi dengan air.
                <div style={equationStyle}>
                  HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)
                </div>
              </InfoBox>

              <InfoBox title="3. Disosiasi Natrium Hidroksida (NaOH)">
                NaOH merupakan basa kuat yang terdisosiasi
                menghasilkan ion natrium dan hidroksida.
                <div style={equationStyle}>
                  NaOH(s) → Na⁺(aq) + OH⁻(aq)
                </div>
              </InfoBox>

              <h3 style={subTitle}>D. Contoh dalam Kehidupan Sehari-hari</h3>

              <p style={paragraph}>
                Garam dapur yang dilarutkan dalam air merupakan
                contoh elektrolit kuat. Ketika larut, NaCl
                terdisosiasi menjadi ion Na⁺ dan Cl⁻ sehingga
                larutan dapat menghantarkan arus listrik.
                Contoh lainnya adalah larutan elektrolit pada
                aki kendaraan yang mengandung asam sulfat.
              </p>

              <InfoBox title="Kesimpulan Elektrolit Kuat" color="green">
                Semakin banyak ion yang dapat bergerak bebas
                dalam larutan, semakin besar kemampuan larutan
                untuk menghantarkan listrik pada kondisi
                konsentrasi dan suhu yang sebanding.
              </InfoBox>
            </div>
          )}

          {/* TAB 3: ELEKTROLIT LEMAH */}
          {activeTab === 'lemah' && (
            <div>
              <h2 style={sectionTitle}>
                3. Larutan Elektrolit Lemah
              </h2>

              <p style={paragraph}>
                Larutan elektrolit lemah adalah larutan yang
                hanya mengalami ionisasi sebagian ketika
                dilarutkan dalam air. Sebagian molekul zat
                terlarut berubah menjadi ion, sedangkan sebagian
                lainnya tetap berada dalam bentuk molekul netral.
                Karena jumlah ion yang terbentuk relatif lebih
                sedikit, kemampuan menghantarkan listriknya
                lebih rendah dibandingkan elektrolit kuat
                pada kondisi yang sebanding.
              </p>

              <InfoBox title="Pengertian Penting" color="orange">
                Elektrolit lemah memiliki derajat ionisasi
                lebih dari 0 tetapi kurang dari 1 (0 < α < 1).
                Artinya, hanya sebagian molekul zat terlarut
                yang mengalami ionisasi.
              </InfoBox>

              <h3 style={subTitle}>A. Ciri-Ciri Elektrolit Lemah</h3>

              <ul style={listStyle}>
                <li>Hanya sebagian molekul mengalami ionisasi.</li>
                <li>Menghasilkan ion dalam jumlah relatif sedikit.</li>
                <li>Sebagian zat terlarut tetap berbentuk molekul netral.</li>
                <li>Memiliki derajat ionisasi antara 0 dan 1.</li>
                <li>Daya hantar listrik relatif rendah.</li>
                <li>Lampu alat uji dapat menyala redup atau tidak terlihat menyala.</li>
                <li>Gelembung gas pada elektroda umumnya lebih sedikit.</li>
              </ul>

              <h3 style={subTitle}>B. Jenis dan Contoh Elektrolit Lemah</h3>

              <p style={paragraph}>
                Elektrolit lemah umumnya berasal dari asam lemah
                dan basa lemah.
              </p>

              <DataTable
                headers={['Jenis', 'Rumus Kimia', 'Nama Senyawa']}
                rows={[
                  ['Asam lemah', 'CH₃COOH', 'Asam asetat'],
                  ['Asam lemah', 'HF', 'Asam fluorida'],
                  ['Asam lemah', 'H₂CO₃', 'Asam karbonat'],
                  ['Asam lemah', 'HCN', 'Asam sianida'],
                  ['Asam lemah', 'H₃PO₄', 'Asam fosfat'],
                  ['Basa lemah', 'NH₃', 'Amonia'],
                  ['Basa lemah', 'CH₃NH₂', 'Metilamina'],
                ]}
              />

              <h3 style={subTitle}>C. Proses Ionisasi Sebagian</h3>

              <p style={paragraph}>
                Pada elektrolit lemah, hanya sebagian molekul
                yang membentuk ion. Proses ionisasi berlangsung
                secara reversibel sehingga terdapat kesetimbangan
                antara molekul yang belum terionisasi dan ion
                yang telah terbentuk. Oleh karena itu, persamaan
                reaksinya menggunakan tanda panah bolak-balik (⇌).
              </p>

              <InfoBox title="1. Ionisasi Asam Asetat (CH₃COOH)" color="orange">
                Asam asetat merupakan asam lemah yang sebagian
                molekulnya bereaksi dengan air membentuk
                ion hidronium dan ion asetat.
                <div style={equationStyle}>
                  CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻
                </div>
                Sebagian besar molekul asam asetat tetap
                berada dalam bentuk molekul netral.
              </InfoBox>

              <InfoBox title="2. Ionisasi Amonia (NH₃)">
                Amonia merupakan basa lemah yang bereaksi
                sebagian dengan air membentuk ion amonium
                dan ion hidroksida.
                <div style={equationStyle}>
                  NH₃ + H₂O ⇌ NH₄⁺ + OH⁻
                </div>
              </InfoBox>

              <h3 style={subTitle}>D. Contoh dalam Kehidupan Sehari-hari</h3>

              <p style={paragraph}>
                Cuka dapur mengandung asam asetat (CH₃COOH).
                Ketika dilarutkan dalam air, sebagian molekul
                asam asetat mengalami ionisasi membentuk ion
                H₃O⁺ dan CH₃COO⁻. Karena ionisasi hanya
                berlangsung sebagian, larutan cuka termasuk
                elektrolit lemah.
              </p>

              <p style={paragraph}>
                Contoh lainnya adalah larutan amonia dalam air
                yang digunakan dalam beberapa produk pembersih.
                Amonia bereaksi sebagian dengan air menghasilkan
                ion NH₄⁺ dan OH⁻.
              </p>

              <InfoBox title="Kesimpulan Elektrolit Lemah" color="orange">
                Elektrolit lemah tetap dapat menghantarkan
                arus listrik karena menghasilkan ion-ion,
                tetapi jumlah ion yang terbentuk lebih sedikit
                dibandingkan elektrolit kuat pada kondisi
                konsentrasi yang sebanding.
              </InfoBox>
            </div>
          )}

          {/* TAB 4: NON ELEKTROLIT */}
          {activeTab === 'non' && (
            <div>
              <h2 style={sectionTitle}>
                4. Larutan Non-Elektrolit
              </h2>

              <p style={paragraph}>
                Larutan non-elektrolit adalah larutan yang
                tidak dapat menghantarkan arus listrik secara
                berarti karena zat terlarutnya tidak membentuk
                ion ketika dilarutkan dalam air. Zat tersebut
                tetap berada dalam bentuk molekul netral.
                Meskipun dapat larut dan tersebar merata,
                molekulnya tidak menghasilkan partikel
                bermuatan yang dapat membawa arus listrik.
              </p>

              <InfoBox title="Pengertian Penting">
                Zat non-elektrolit dapat larut dalam air tanpa
                mengalami ionisasi. Oleh karena itu, larutnya
                suatu zat tidak selalu berarti terbentuknya ion.
              </InfoBox>

              <h3 style={subTitle}>A. Ciri-Ciri Non-Elektrolit</h3>

              <ul style={listStyle}>
                <li>Tidak mengalami ionisasi dalam air.</li>
                <li>Zat terlarut tetap berbentuk molekul netral.</li>
                <li>Tidak menghasilkan ion bebas dari zat terlarut.</li>
                <li>Tidak dapat menghantarkan listrik secara berarti.</li>
                <li>Lampu alat uji elektrolit tidak menyala.</li>
                <li>Tidak terbentuk gelembung akibat elektrolisis zat terlarut.</li>
              </ul>

              <h3 style={subTitle}>B. Contoh Zat Non-Elektrolit</h3>

              <DataTable
                headers={['Rumus Kimia', 'Nama Senyawa', 'Contoh Penggunaan']}
                rows={[
                  ['C₁₂H₂₂O₁₁', 'Sukrosa', 'Gula pasir'],
                  ['C₆H₁₂O₆', 'Glukosa', 'Gula sederhana'],
                  ['C₂H₅OH', 'Etanol', 'Alkohol'],
                  ['CO(NH₂)₂', 'Urea', 'Pupuk urea'],
                  ['C₃H₈O₃', 'Gliserol', 'Bahan pelembap'],
                ]}
              />

              <h3 style={subTitle}>C. Proses Pelarutan Non-Elektrolit</h3>

              <p style={paragraph}>
                Ketika zat non-elektrolit dilarutkan dalam air,
                molekul zat terlarut akan terpisah satu sama lain
                dan tersebar di antara molekul air. Namun,
                molekul tersebut tidak terurai menjadi ion.
                Proses ini disebut pelarutan, bukan ionisasi.
              </p>

              <InfoBox title="1. Pelarutan Gula (Sukrosa)">
                Gula pasir merupakan senyawa molekuler yang
                dapat larut dalam air. Ketika dilarutkan,
                molekul sukrosa tetap utuh dan tidak membentuk
                ion.
                <div style={equationStyle}>
                  C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)
                </div>
              </InfoBox>

              <InfoBox title="2. Pelarutan Urea">
                Urea merupakan senyawa kovalen yang larut
                dalam air tanpa membentuk ion.
                <div style={equationStyle}>
                  CO(NH₂)₂(s) → CO(NH₂)₂(aq)
                </div>
              </InfoBox>

              <h3 style={subTitle}>D. Contoh dalam Kehidupan Sehari-hari</h3>

              <p style={paragraph}>
                Air gula merupakan contoh larutan non-elektrolit.
                Ketika gula dilarutkan dalam air, molekul sukrosa
                tersebar merata tetapi tidak membentuk ion.
                Oleh karena itu, air gula tidak dapat
                menghantarkan arus listrik secara berarti.
              </p>

              <p style={paragraph}>
                Contoh lainnya adalah larutan urea dan etanol.
                Keduanya dapat larut dalam air, tetapi tidak
                menghasilkan ion melalui proses pelarutan.
              </p>

              <InfoBox title="Kesimpulan Non-Elektrolit">
                Zat non-elektrolit tetap dapat larut dalam air,
                tetapi tidak menghasilkan ion-ion bebas.
                Dengan demikian, larutan tersebut tidak
                memiliki kemampuan menghantarkan arus
                listrik secara berarti.
              </InfoBox>
            </div>
          )}

          {/* TAB 5: PERBANDINGAN */}
          {activeTab === 'perbandingan' && (
            <div>
              <h2 style={sectionTitle}>
                5. Perbandingan Larutan Elektrolit Kuat,
                Elektrolit Lemah, dan Non-Elektrolit
              </h2>

              <p style={paragraph}>
                Ketiga jenis larutan memiliki karakteristik
                berbeda berdasarkan kemampuan zat terlarut
                menghasilkan ion dalam air. Perbedaan tersebut
                dapat dilihat dari proses ionisasi, jumlah ion,
                derajat ionisasi, serta hasil pengujian daya
                hantar listrik.
              </p>

              <h3 style={subTitle}>A. Tabel Perbandingan Ketiga Larutan</h3>

              <DataTable
                headers={[
                  'Aspek',
                  'Elektrolit Kuat',
                  'Elektrolit Lemah',
                  'Non-Elektrolit',
                ]}
                rows={[
                  [
                    'Ionisasi/disosiasi',
                    'Hampir sempurna',
                    'Sebagian',
                    'Tidak menghasilkan ion',
                  ],
                  [
                    'Jumlah ion',
                    'Relatif banyak',
                    'Relatif sedikit',
                    'Tidak ada ion dari zat terlarut',
                  ],
                  [
                    'Derajat ionisasi',
                    'Mendekati 1',
                    '0 < α < 1',
                    '0 (dalam penyederhanaan SMA)',
                  ],
                  [
                    'Daya hantar listrik',
                    'Relatif tinggi',
                    'Relatif rendah',
                    'Tidak berarti',
                  ],
                  [
                    'Nyala lampu',
                    'Umumnya terang',
                    'Redup atau terkadang padam',
                    'Padam',
                  ],
                  [
                    'Gelembung gas',
                    'Umumnya banyak',
                    'Umumnya sedikit',
                    'Tidak ada akibat elektrolisis zat terlarut',
                  ],
                  [
                    'Contoh',
                    'NaCl, HCl, NaOH',
                    'CH₃COOH, NH₃, HF',
                    'Gula, urea, etanol',
                  ],
                ]}
              />

              <h3 style={subTitle}>B. Derajat Ionisasi (α)</h3>

              <p style={paragraph}>
                Derajat ionisasi merupakan perbandingan antara
                jumlah mol zat yang mengalami ionisasi dengan
                jumlah mol zat mula-mula yang dilarutkan.
                Besaran ini digunakan untuk menggambarkan
                seberapa besar bagian zat yang terionisasi.
              </p>

              <div style={equationStyle}>
                α = Mol zat yang terionisasi / Mol zat mula-mula
              </div>

              <p style={paragraph}>
                Berdasarkan derajat ionisasinya, larutan
                dapat dikelompokkan sebagai berikut:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '1rem',
              }}>
                <div style={{
                  ...cardStyle,
                  backgroundColor: 'var(--strong-bg)',
                  borderColor: 'var(--strong-border)',
                }}>
                  <h3 style={{ color: 'var(--strong-text)' }}>
                    Elektrolit Kuat
                  </h3>
                  <h2 style={{ fontSize: '1.5rem' }}>α ≈ 1</h2>
                  <p style={paragraph}>
                    Ionisasi atau disosiasi hampir sempurna.
                  </p>
                </div>

                <div style={{
                  ...cardStyle,
                  backgroundColor: 'var(--weak-bg)',
                  borderColor: 'var(--weak-border)',
                }}>
                  <h3 style={{ color: 'var(--weak-text)' }}>
                    Elektrolit Lemah
                  </h3>
                  <h2 style={{ fontSize: '1.5rem' }}>0 &lt; α &lt; 1</h2>
                  <p style={paragraph}>
                    Ionisasi hanya berlangsung sebagian.
                  </p>
                </div>

                <div style={{
                  ...cardStyle,
                  backgroundColor: 'var(--non-bg)',
                  borderColor: 'var(--non-border)',
                }}>
                  <h3 style={{ color: 'var(--slate-700)' }}>
                    Non-Elektrolit
                  </h3>
                  <h2 style={{ fontSize: '1.5rem' }}>α = 0</h2>
                  <p style={paragraph}>
                    Tidak terjadi ionisasi zat terlarut.
                  </p>
                </div>
              </div>

              <h3 style={subTitle}>C. Contoh Perhitungan Derajat Ionisasi</h3>

              <p style={paragraph}>
                Sebanyak 0,5 mol suatu zat elektrolit dilarutkan
                dalam air. Dari jumlah tersebut, 0,1 mol
                mengalami ionisasi. Berapakah derajat ionisasinya?
              </p>

              <InfoBox title="Penyelesaian">
                Diketahui:
                <br />
                Mol zat mula-mula = 0,5 mol
                <br />
                Mol zat terionisasi = 0,1 mol
                <br /><br />
                Ditanya: Derajat ionisasi (α).
                <div style={equationStyle}>
                  α = 0,1 / 0,5
                  <br /><br />
                  α = 0,2 = 20%
                </div>
                Jadi, derajat ionisasi zat tersebut adalah 0,2
                atau 20%. Artinya, sebanyak 20% zat mengalami
                ionisasi, sedangkan sisanya masih berupa
                molekul yang belum terionisasi.
              </InfoBox>

              <h3 style={subTitle}>D. Hasil Pengujian Daya Hantar Listrik</h3>

              <p style={paragraph}>
                Untuk membedakan ketiga jenis larutan, dapat
                dilakukan percobaan menggunakan alat uji
                elektrolit. Alat ini terdiri atas baterai,
                kabel, lampu, dan elektroda yang dicelupkan
                ke dalam larutan.
              </p>

              <div style={{
                backgroundColor: 'var(--slate-50)',
                padding: '1.25rem',
                borderRadius: '12px',
                margin: '1rem 0',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '0.75rem',
                }}>
                  <FlaskConical color="var(--teal-600)" size={23} />
                  <h3 style={{ margin: 0 }}>Hasil Pengamatan</h3>
                </div>

                <DataTable
                  headers={[
                    'Jenis Larutan',
                    'Lampu',
                    'Gelembung Gas',
                  ]}
                  rows={[
                    ['Elektrolit kuat', 'Terang', 'Banyak'],
                    ['Elektrolit lemah', 'Redup atau padam', 'Sedikit'],
                    ['Non-elektrolit', 'Padam', 'Tidak ada'],
                  ]}
                />
              </div>

              <h3 style={subTitle}>E. Faktor yang Memengaruhi Daya Hantar Listrik</h3>

              <p style={paragraph}>
                Kemampuan larutan dalam menghantarkan listrik
                tidak hanya ditentukan oleh jenis elektrolit,
                tetapi juga dipengaruhi beberapa faktor berikut:
              </p>

              <ol style={listStyle}>
                <li>
                  <strong>Jumlah ion:</strong> banyaknya ion
                  yang bergerak bebas memengaruhi kemampuan
                  larutan menghantarkan listrik.
                </li>
                <li>
                  <strong>Konsentrasi larutan:</strong> jumlah
                  ion per satuan volume dapat berubah sesuai
                  konsentrasi larutan.
                </li>
                <li>
                  <strong>Jenis zat terlarut:</strong> setiap
                  zat memiliki kemampuan berbeda dalam
                  menghasilkan ion.
                </li>
                <li>
                  <strong>Suhu:</strong> perubahan suhu dapat
                  memengaruhi mobilitas ion dalam larutan.
                </li>
              </ol>

              <InfoBox title="Catatan Penting">
                Nyala lampu tidak selalu menjadi satu-satunya
                indikator kekuatan elektrolit. Hasil pengujian
                dipengaruhi konsentrasi, suhu, jenis elektroda,
                dan sensitivitas alat. Elektrolit lemah tetap
                dapat menghantarkan listrik meskipun lampu
                tidak terlihat menyala.
              </InfoBox>

              <InfoBox title="Kesimpulan Perbandingan" color="green">
                Elektrolit kuat menghasilkan ion hampir sempurna,
                elektrolit lemah hanya menghasilkan ion sebagian,
                sedangkan non-elektrolit tidak menghasilkan ion
                melalui proses pelarutan. Perbedaan tersebut
                menyebabkan kemampuan daya hantar listrik
                ketiganya berbeda.
              </InfoBox>
            </div>
          )}

          {/* TAB 6: ARRHENIUS */}
          {activeTab === 'arrhenius' && (
            <div>
              <h2 style={sectionTitle}>
                6. Teori Ionisasi Svante Arrhenius
              </h2>

              <p style={paragraph}>
                Svante August Arrhenius merupakan ilmuwan asal
                Swedia yang mengemukakan teori ionisasi pada
                tahun 1887. Teori ini menjelaskan bahwa zat
                elektrolit ketika dilarutkan dalam air akan
                menghasilkan ion-ion yang dapat bergerak bebas.
                Ion-ion tersebut berperan dalam menghantarkan
                arus listrik melalui larutan.
              </p>

              <InfoBox title="Konsep Utama Teori Arrhenius">
                Zat elektrolit dapat menghasilkan ion ketika
                dilarutkan dalam air. Keberadaan ion-ion tersebut
                menyebabkan larutan mampu menghantarkan
                arus listrik.
              </InfoBox>

              <h3 style={subTitle}>A. Pengertian Asam Menurut Arrhenius</h3>

              <p style={paragraph}>
                Menurut teori Arrhenius, asam adalah zat yang
                meningkatkan konsentrasi ion H⁺ dalam air.
                Dalam larutan berair, ion H⁺ berikatan dengan
                molekul air membentuk ion hidronium (H₃O⁺).
              </p>

              <div style={equationStyle}>
                HCl + H₂O → H₃O⁺ + Cl⁻
              </div>

              <p style={paragraph}>
                Contoh lainnya adalah asam nitrat (HNO₃)
                yang menghasilkan ion hidronium dan ion nitrat
                ketika bereaksi dengan air.
              </p>

              <div style={equationStyle}>
                HNO₃ + H₂O → H₃O⁺ + NO₃⁻
              </div>

              <h3 style={subTitle}>B. Pengertian Basa Menurut Arrhenius</h3>

              <p style={paragraph}>
                Menurut teori Arrhenius, basa adalah zat yang
                meningkatkan konsentrasi ion hidroksida (OH⁻)
                ketika dilarutkan dalam air.
              </p>

              <div style={equationStyle}>
                NaOH → Na⁺ + OH⁻
              </div>

              <p style={paragraph}>
                Contoh lainnya adalah kalium hidroksida (KOH)
                yang terdisosiasi menghasilkan ion kalium
                dan ion hidroksida.
              </p>

              <div style={equationStyle}>
                KOH → K⁺ + OH⁻
              </div>

              <h3 style={subTitle}>C. Hubungan Teori Arrhenius dengan Elektrolit</h3>

              <p style={paragraph}>
                Teori Arrhenius membantu menjelaskan mengapa
                larutan asam dan basa dapat menghantarkan arus
                listrik. Ketika zat asam atau basa dilarutkan
                dalam air, zat tersebut menghasilkan ion-ion
                yang dapat bergerak bebas.
              </p>

              <p style={paragraph}>
                Asam kuat dan basa kuat umumnya menghasilkan
                ion dalam jumlah besar karena mengalami
                ionisasi atau disosiasi hampir sempurna.
                Sementara itu, asam lemah dan basa lemah hanya
                mengalami ionisasi sebagian sehingga jumlah
                ion yang dihasilkan lebih sedikit.
              </p>

              <h3 style={subTitle}>D. Kelebihan dan Keterbatasan Teori Arrhenius</h3>

              <DataTable
                headers={['Aspek', 'Penjelasan']}
                rows={[
                  [
                    'Kelebihan',
                    'Menjelaskan sifat asam dan basa berdasarkan pembentukan ion dalam air.',
                  ],
                  [
                    'Kelebihan',
                    'Membantu menjelaskan mengapa larutan asam dan basa dapat menghantarkan listrik.',
                  ],
                  [
                    'Keterbatasan',
                    'Hanya menjelaskan sifat asam dan basa dalam pelarut air.',
                  ],
                  [
                    'Keterbatasan',
                    'Belum dapat menjelaskan seluruh reaksi asam-basa yang tidak melibatkan pembentukan H⁺ atau OH⁻ secara langsung.',
                  ],
                ]}
              />

              <InfoBox title="Kesimpulan Teori Arrhenius" color="green">
                Teori Arrhenius menjelaskan bahwa keberadaan
                ion merupakan dasar kemampuan larutan elektrolit
                dalam menghantarkan listrik. Teori ini juga
                menjadi dasar untuk memahami sifat asam dan
                basa berdasarkan ion yang dihasilkan dalam air.
              </InfoBox>
            </div>
          )}

        </div>

        {/* NAVIGASI ANTARMATERI */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}>
          <button
            onClick={() => {
              const currentIndex = tabs.findIndex(
                tab => tab.id === activeTab
              );
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}
            disabled={activeTab === 'dasar'}
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: '8px',
              border: '1px solid var(--slate-200)',
              background: '#ffffff',
              color: 'var(--navy-900)',
              cursor: activeTab === 'dasar' ? 'not-allowed' : 'pointer',
              opacity: activeTab === 'dasar' ? 0.4 : 1,
            }}
          >
            ← Materi Sebelumnya
          </button>

          <span style={{
            fontSize: '0.85rem',
            color: 'var(--slate-500)',
            fontWeight: 600,
          }}>
            Materi {tabs.findIndex(tab => tab.id === activeTab) + 1} dari 6
          </span>

          <button
            onClick={() => {
              const currentIndex = tabs.findIndex(
                tab => tab.id === activeTab
              );
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].id);
              }
            }}
            disabled={activeTab === 'arrhenius'}
            style={{
              padding: '0.75rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--teal-600)',
              color: '#ffffff',
              cursor: activeTab === 'arrhenius' ? 'not-allowed' : 'pointer',
              opacity: activeTab === 'arrhenius' ? 0.4 : 1,
            }}
          >
            Materi Selanjutnya →
          </button>
        </div>

        {/* CTA LABORATORIUM VIRTUAL */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--slate-200)',
          padding: '1.5rem 2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--navy-900)',
            }}>
              Sudah Memahami Konsepnya?
            </h4>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--slate-600)',
              lineHeight: 1.6,
            }}>
              Uji pemahamanmu dengan melakukan eksperimen
              langsung di Laboratorium Virtual.
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