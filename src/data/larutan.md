# Dataset Laboratorium Virtual — Elektrolit dan Nonelektrolit

**Versi:** 1.0  
**Tujuan:** sumber data acuan untuk fitur Laboratorium Virtual dan Lembar Kerja.  
**Format data:** JSON UTF-8, dapat disalin dari blok di bawah ke berkas `larutan.json`.

> **Batasan penting:** ini adalah dataset untuk simulasi pembelajaran, bukan protokol praktikum. Sampel yang diberi catatan keselamatan tidak boleh disiapkan atau diuji sendiri oleh siswa. Gunakan simulasi digital dan pengawasan guru untuk kegiatan laboratorium nyata.

## 1. Konvensi kimia dan model

- Pelarut acuan adalah air pada sekitar 25 °C.
- Kategori menunjukkan **perilaku zat terlarut dalam air**, bukan besar-kecilnya konsentrasi.
- Elektrolit kuat: zat terlarut menghasilkan ion secara hampir menyeluruh (misalnya garam ionik yang larut).
- Elektrolit lemah: molekul hanya terionisasi/ bereaksi dengan air sebagian dan membentuk kesetimbangan.
- Nonelektrolit: larut sebagai molekul netral, tanpa pembentukan ion yang berarti.
- CO₂(aq) berada dalam kesetimbangan dengan H₂CO₃; tidak semua CO₂ terlarut berubah menjadi H₂CO₃.
- Untuk asam poliprotik, persamaan yang ditampilkan adalah tahap pertama kecuali dinyatakan lain.
- Panah `→` dipakai untuk disosiasi/pelarutan yang dianggap hampir lengkap; `⇌` untuk kesetimbangan parsial.
- Persamaan nonelektrolit menunjukkan pelarutan molekuler, bukan ionisasi.

### Pemetaan visual (aturan pedagogis)

| Kategori acuan | Lampu | Gelembung |
|---|---|---|
| `elektrolit_kuat` | `terang` | `banyak` |
| `elektrolit_lemah` | `redup` | `sedikit` |
| `nonelektrolit` | `mati` | `tidak_ada` |

Pemetaan tersebut adalah **model kualitatif**, bukan hukum kuantitatif. Intensitas arus nyata dipengaruhi konsentrasi ion, mobilitas ion, suhu, geometri dan bahan elektroda, tegangan, serta waktu. Gelembung pada simulasi merepresentasikan gas hasil **elektrolisis di permukaan elektroda**; ionisasi/disosiasi saja tidak otomatis menghasilkan gelembung. Dalam model elektrolisis air dengan elektroda inert, reaksi ideal keseluruhan dapat ditulis:

- Katode: `2 H₂O(l) + 2 e⁻ → H₂(g) + 2 OH⁻(aq)`
- Anode: `2 H₂O(l) → O₂(g) + 4 H⁺(aq) + 4 e⁻`
- Keseluruhan: `2 H₂O(l) → 2 H₂(g) + O₂(g)`

Produk elektrolisis aktual bergantung pada komposisi larutan dan elektroda. Dataset ini tidak dimaksudkan untuk memprediksi produk elektrolisis spesifik setiap sampel.

### Parameter simulasi yang disarankan

| Parameter | Nilai model |
|---|---|
| Suhu acuan | 25 °C |
| Tegangan simulasi | 6 V DC (parameter visual perangkat lunak, bukan rekomendasi alat praktikum) |
| Waktu pengamatan | 10 s |
| Volume virtual | 100 mL |
| Elektroda | dua elektroda inert virtual, bahan identik |
| Jarak elektroda | 2 cm |
| Luas permukaan terendam | tetap untuk semua sampel |
| Konsentrasi | gunakan `kondisi_acuan` per sampel; jangan menyamakan konsentrasi dengan kekuatan elektrolit |
| Model gelembung | jumlah gelembung mengikuti kategori pedagogis, bukan hasil hitung stoikiometri |

Tegangan dan parameter di atas hanya untuk menyamakan kondisi animasi. Jangan menganggapnya sebagai instruksi merakit rangkaian atau melakukan elektrolisis secara fisik.

## 2. Percobaan 1 — Sampel larutan baku (30 sampel)

Tepat 10 sampel elektrolit kuat, 10 elektrolit lemah, dan 10 nonelektrolit.

```json
{
  "percobaan_1": [
    {
      "id": "K01",
      "nama": "Natrium klorida",
      "rumus": "NaCl",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NaCl(s) → Na⁺(aq) + Cl⁻(aq)",
      "alasan": "Larutan terdisosiasi hampir seluruhnya menjadi ion Na⁺ dan Cl⁻ yang bergerak bebas.",
      "catatan_keselamatan_batasan": "Acuan simulasi; jangan menafsirkan nyala terang sebagai ukuran konsentrasi."
    },
    {
      "id": "K02",
      "nama": "Kalium klorida",
      "rumus": "KCl",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "KCl(s) → K⁺(aq) + Cl⁻(aq)",
      "alasan": "Garam ionik yang larut dan terdisosiasi hampir seluruhnya menjadi K⁺ dan Cl⁻.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "K03",
      "nama": "Kalium nitrat",
      "rumus": "KNO₃",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "KNO₃(s) → K⁺(aq) + NO₃⁻(aq)",
      "alasan": "Kalium nitrat larut dalam air; bagian yang terlarut hadir sebagai ion K⁺ dan NO₃⁻.",
      "catatan_keselamatan_batasan": "Acuan virtual. Garam nitrat adalah oksidator dalam bentuk padat; jangan menyiapkan sampel nyata."
    },
    {
      "id": "K04",
      "nama": "Natrium nitrat",
      "rumus": "NaNO₃",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NaNO₃(s) → Na⁺(aq) + NO₃⁻(aq)",
      "alasan": "Garam natrium ini larut dan terdisosiasi hampir sempurna dalam air.",
      "catatan_keselamatan_batasan": "Acuan virtual. Garam nitrat tidak perlu disiapkan siswa."
    },
    {
      "id": "K05",
      "nama": "Kalsium klorida",
      "rumus": "CaCl₂",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "CaCl₂(s) → Ca²⁺(aq) + 2 Cl⁻(aq)",
      "alasan": "Satu satuan formula menghasilkan satu ion Ca²⁺ dan dua ion Cl⁻ dalam larutan.",
      "catatan_keselamatan_batasan": "Pelarutan dapat melepaskan kalor; gunakan hanya sebagai data simulasi."
    },
    {
      "id": "K06",
      "nama": "Magnesium klorida",
      "rumus": "MgCl₂",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "MgCl₂(s) → Mg²⁺(aq) + 2 Cl⁻(aq)",
      "alasan": "Garam larut dan terdisosiasi menjadi ion magnesium dan klorida.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "K07",
      "nama": "Amonium klorida",
      "rumus": "NH₄Cl",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NH₄Cl(s) → NH₄⁺(aq) + Cl⁻(aq)",
      "alasan": "Amonium klorida merupakan elektrolit ionik larut; ionnya tersedia dalam larutan.",
      "catatan_keselamatan_batasan": "Hindari kontak atau tertelan; data ini untuk simulasi."
    },
    {
      "id": "K08",
      "nama": "Natrium sulfat",
      "rumus": "Na₂SO₄",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "Na₂SO₄(s) → 2 Na⁺(aq) + SO₄²⁻(aq)",
      "alasan": "Garam larut dan menghasilkan dua ion Na⁺ untuk setiap ion SO₄²⁻.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "K09",
      "nama": "Kalium bromida",
      "rumus": "KBr",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "KBr(s) → K⁺(aq) + Br⁻(aq)",
      "alasan": "Garam ionik larut yang terdisosiasi hampir seluruhnya.",
      "catatan_keselamatan_batasan": "Acuan simulasi; tidak untuk penyiapan mandiri."
    },
    {
      "id": "K10",
      "nama": "Kalium iodida",
      "rumus": "KI",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "KI(s) → K⁺(aq) + I⁻(aq)",
      "alasan": "Kalium iodida larut dan terdisosiasi menjadi K⁺ serta I⁻.",
      "catatan_keselamatan_batasan": "Acuan simulasi; hindari konsumsi atau kontak yang tidak perlu."
    },
    {
      "id": "L01",
      "nama": "Asam asetat",
      "rumus": "CH₃COOH",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)",
      "alasan": "Asam asetat hanya terionisasi sebagian; sebagian besar tetap sebagai molekul CH₃COOH.",
      "catatan_keselamatan_batasan": "Larutan encer untuk simulasi; asam pekat bersifat korosif dan tidak boleh ditangani siswa."
    },
    {
      "id": "L02",
      "nama": "Asam karbonat",
      "rumus": "H₂CO₃",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "Model CO₂(aq) ⇌ H₂CO₃; 0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "H₂CO₃(aq) + H₂O(l) ⇌ H₃O⁺(aq) + HCO₃⁻(aq)",
      "alasan": "Sebagian CO₂ terlarut bereaksi dengan air membentuk H₂CO₃ yang hanya terionisasi sebagian; ion yang terbentuk terbatas.",
      "catatan_keselamatan_batasan": "Model kesetimbangan disederhanakan; jangan menganggap seluruh CO₂ terlarut menjadi H₂CO₃ molekuler."
    },
    {
      "id": "L03",
      "nama": "Asam fosfat",
      "rumus": "H₃PO₄",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "H₃PO₄(aq) + H₂O(l) ⇌ H₃O⁺(aq) + H₂PO₄⁻(aq)",
      "alasan": "Ionisasi tahap pertama berlangsung sebagian; tahap berikutnya lebih lemah dan tidak ditampilkan di persamaan ringkas ini.",
      "catatan_keselamatan_batasan": "Asam dapat mengiritasi/merusak jaringan pada konsentrasi tinggi; simulasi saja."
    },
    {
      "id": "L04",
      "nama": "Asam sitrat",
      "rumus": "C₆H₈O₇",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "C₆H₈O₇(aq) + H₂O(l) ⇌ H₃O⁺(aq) + C₆H₇O₇⁻(aq)",
      "alasan": "Asam sitrat adalah asam triprotik; pelepasan proton berlangsung bertahap dan tidak sempurna.",
      "catatan_keselamatan_batasan": "Acuan memakai tahap pertama saja."
    },
    {
      "id": "L05",
      "nama": "Asam laktat",
      "rumus": "C₃H₆O₃",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "C₃H₆O₃(aq) + H₂O(l) ⇌ H₃O⁺(aq) + C₃H₅O₃⁻(aq)",
      "alasan": "Asam laktat terionisasi sebagian membentuk ion laktat dan hidronium.",
      "catatan_keselamatan_batasan": "Acuan simulasi; larutan pekat dapat mengiritasi."
    },
    {
      "id": "L06",
      "nama": "Asam askorbat (vitamin C)",
      "rumus": "C₆H₈O₆",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "C₆H₈O₆(aq) + H₂O(l) ⇌ H₃O⁺(aq) + C₆H₇O₆⁻(aq)",
      "alasan": "Asam askorbat merupakan asam lemah; ionisasi tahap pertama berlangsung sebagian.",
      "catatan_keselamatan_batasan": "Acuan tahap pertama."
    },
    {
      "id": "L07",
      "nama": "Asam borat",
      "rumus": "H₃BO₃ atau B(OH)₃",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "B(OH)₃(aq) + 2 H₂O(l) ⇌ B(OH)₄⁻(aq) + H₃O⁺(aq)",
      "alasan": "Asam borat bertindak sebagai asam Lewis dalam air dengan menerima pasangan elektron dari OH⁻; kesetimbangan menghasilkan borat dan hidronium.",
      "catatan_keselamatan_batasan": "Jangan digunakan untuk praktikum mandiri; paparan borat perlu dihindari."
    },
    {
      "id": "L08",
      "nama": "Asam benzoat",
      "rumus": "C₇H₆O₂",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.005 mol/L; 25 °C; diasumsikan seluruh dosis terlarut",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "C₆H₅COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + C₆H₅COO⁻(aq)",
      "alasan": "Asam benzoat adalah asam lemah; hanya sebagian molekul terionisasi. Konsentrasi acuan dipilih di bawah kelarutan airnya pada suhu ruang.",
      "catatan_keselamatan_batasan": "Kelarutan terbatas; jika belum seluruhnya larut, konsentrasi aktual lebih rendah."
    },
    {
      "id": "L09",
      "nama": "Asam propionat",
      "rumus": "C₃H₆O₂",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "C₂H₅COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + C₂H₅COO⁻(aq)",
      "alasan": "Asam propionat adalah asam karboksilat lemah yang terionisasi sebagian.",
      "catatan_keselamatan_batasan": "Larutan pekat bersifat iritan/korosif; data simulasi saja."
    },
    {
      "id": "L10",
      "nama": "Amonia dalam air",
      "rumus": "NH₃(aq)",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)",
      "alasan": "Amonia merupakan basa lemah; hanya sebagian molekul bereaksi dengan air membentuk NH₄⁺ dan OH⁻.",
      "catatan_keselamatan_batasan": "Uap/larutan amonia dapat mengiritasi dan berbahaya; simulasi saja, jangan disiapkan siswa."
    },
    {
      "id": "N01",
      "nama": "Sukrosa (gula pasir)",
      "rumus": "C₁₂H₂₂O₁₁",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)",
      "alasan": "Sukrosa larut sebagai molekul netral dan tidak menghasilkan ion dalam jumlah berarti.",
      "catatan_keselamatan_batasan": "Acuan nonelektrolit; persamaan menunjukkan pelarutan, bukan ionisasi."
    },
    {
      "id": "N02",
      "nama": "Glukosa",
      "rumus": "C₆H₁₂O₆",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₆H₁₂O₆(s) → C₆H₁₂O₆(aq)",
      "alasan": "Glukosa larut sebagai molekul netral; tidak terdisosiasi menjadi ion.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "N03",
      "nama": "Fruktosa",
      "rumus": "C₆H₁₂O₆",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₆H₁₂O₆(s) → C₆H₁₂O₆(aq)",
      "alasan": "Fruktosa adalah molekul kovalen yang larut tanpa membentuk ion bermakna.",
      "catatan_keselamatan_batasan": "Rumus molekul sama dengan glukosa, tetapi struktur berbeda."
    },
    {
      "id": "N04",
      "nama": "Laktosa",
      "rumus": "C₁₂H₂₂O₁₁",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)",
      "alasan": "Laktosa larut sebagai molekul netral dan bukan sumber ion dalam jumlah berarti.",
      "catatan_keselamatan_batasan": "Acuan konsentrasi konservatif karena kelarutan lebih terbatas daripada sukrosa."
    },
    {
      "id": "N05",
      "nama": "Maltosa",
      "rumus": "C₁₂H₂₂O₁₁",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)",
      "alasan": "Maltosa merupakan gula molekuler; pelarutannya tidak menghasilkan ion.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "N06",
      "nama": "Gliserol",
      "rumus": "C₃H₈O₃",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₃H₈O₃(l) → C₃H₈O₃(aq)",
      "alasan": "Gliserol bercampur dengan air sebagai molekul netral dan tidak terionisasi secara berarti.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "N07",
      "nama": "Urea",
      "rumus": "CH₄N₂O",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "CH₄N₂O(s) → CH₄N₂O(aq)",
      "alasan": "Urea larut sebagai molekul netral; larutan urea murni tidak menghasilkan ion bermakna.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "N08",
      "nama": "Etanol",
      "rumus": "C₂H₆O",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₂H₅OH(l) → C₂H₅OH(aq)",
      "alasan": "Etanol bercampur dengan air sebagai molekul dan tidak menghasilkan ion dalam jumlah berarti.",
      "catatan_keselamatan_batasan": "Etanol mudah terbakar; tidak perlu digunakan secara fisik dalam pembelajaran ini."
    },
    {
      "id": "N09",
      "nama": "Propilen glikol",
      "rumus": "C₃H₈O₂",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₃H₈O₂(l) → C₃H₈O₂(aq)",
      "alasan": "Propilen glikol larut sebagai molekul netral, bukan elektrolit.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    },
    {
      "id": "N10",
      "nama": "Sorbitol",
      "rumus": "C₆H₁₄O₆",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₆H₁₄O₆(s) → C₆H₁₄O₆(aq)",
      "alasan": "Sorbitol larut sebagai molekul netral dan tidak membentuk ion bermakna.",
      "catatan_keselamatan_batasan": "Acuan simulasi."
    }
  ]
}
```

## 3. Percobaan 2 — Larutan sehari-hari (9 sampel)

Komposisi larutan sehari-hari berubah menurut sumber, merek, pengenceran, dan cara pembuatan. Nilai di bawah adalah **asumsi model** agar hasil simulasi deterministik, bukan klaim komposisi semua produk nyata.

```json
{
  "percobaan_2": [
    {
      "id": "H01",
      "nama": "Air garam",
      "rumus": "NaCl dalam H₂O",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "Model: NaCl 0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NaCl(s) → Na⁺(aq) + Cl⁻(aq)",
      "alasan": "Komponen utama yang dimodelkan adalah NaCl terlarut; garam terdisosiasi menjadi ion Na⁺ dan Cl⁻.",
      "catatan_keselamatan_batasan": "Kadar garam air sehari-hari bervariasi; nilai ini adalah asumsi simulasi, bukan resep."
    },
    {
      "id": "H02",
      "nama": "Air cuka",
      "rumus": "CH₃COOH dalam H₂O",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "Model: asam asetat 0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)",
      "alasan": "Asam asetat adalah asam lemah dan hanya terionisasi sebagian. Cuka komersial juga mengandung air dan dapat memiliki komposisi berbeda.",
      "catatan_keselamatan_batasan": "Cuka nyata bukan larutan asam asetat murni; simulasi memakai model encer."
    },
    {
      "id": "H03",
      "nama": "Air gula",
      "rumus": "Sukrosa dalam H₂O",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "Model: sukrosa 0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)",
      "alasan": "Sukrosa larut sebagai molekul netral dan tidak menghasilkan ion bermakna.",
      "catatan_keselamatan_batasan": "Komposisi gula sehari-hari bervariasi; model menganggap sukrosa sebagai zat terlarut utama."
    },
    {
      "id": "H04",
      "nama": "Air suling",
      "rumus": "H₂O",
      "kategori_acuan": "nonelektrolit",
      "kondisi_acuan": "Air sangat murni; 25 °C; pendekatan pembelajaran",
      "nyala_lampu_benar": "mati",
      "gelembung_benar": "tidak_ada",
      "persamaan_reaksi": "2 H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq)",
      "alasan": "Air mengalami autoionisasi sangat kecil; untuk simulasi dasar dikategorikan nonelektrolit karena konsentrasi ionnya amat rendah.",
      "catatan_keselamatan_batasan": "Secara kimia bukan nol ion. Kategori nonelektrolit adalah penyederhanaan pedagogis."
    },
    {
      "id": "H05",
      "nama": "Air jeruk",
      "rumus": "Asam sitrat dan komponen ionik alami",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "Model: ekuivalen asam sitrat 0.010 mol/L; komponen garam alami diabaikan",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "C₆H₈O₇(aq) + H₂O(l) ⇌ H₃O⁺(aq) + C₆H₇O₇⁻(aq)",
      "alasan": "Asam sitrat terionisasi bertahap dan sebagian. Jeruk nyata juga mengandung ion kalium dan mineral sehingga dapat menghantarkan lebih baik daripada model asam sitrat murni.",
      "catatan_keselamatan_batasan": "Komposisi jeruk dipengaruhi jenis, kematangan, dan pengenceran; kategori ini penyederhanaan."
    },
    {
      "id": "H06",
      "nama": "Air mineral",
      "rumus": "Ion mineral terlarut (model NaHCO₃)",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "Model ideal: NaHCO₃ 0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NaHCO₃(s) → Na⁺(aq) + HCO₃⁻(aq)",
      "alasan": "Ion mineral terlarut sudah hadir sebagai ion; bikarbonat juga dapat terlibat dalam kesetimbangan asam-basa.",
      "catatan_keselamatan_batasan": "Air mineral komersial memiliki komposisi dan kadar ion berbeda; terang/redup aktual bergantung konduktivitas total."
    },
    {
      "id": "H07",
      "nama": "Air keran",
      "rumus": "Campuran ion mineral terlarut",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "Model ideal: garam terlarut total disederhanakan sebagai 0.005 mol/L NaCl-ekuivalen; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NaCl(s) → Na⁺(aq) + Cl⁻(aq) (model ionik representatif; bukan klaim komposisi air keran)",
      "alasan": "Ion mineral dalam air keran dapat bergerak dan menghantarkan arus. Garam representatif hanya dipakai untuk menjelaskan keberadaan ion.",
      "catatan_keselamatan_batasan": "Komposisi air keran sangat bervariasi. Dalam kondisi nyata lampu dapat redup karena kadar ion rendah; pemetaan terang adalah label kategori dalam model, bukan prediksi pengukuran."
    },
    {
      "id": "H08",
      "nama": "Larutan soda kue",
      "rumus": "Natrium bikarbonat dalam H₂O",
      "kategori_acuan": "elektrolit_kuat",
      "kondisi_acuan": "Model: NaHCO₃ 0.050 mol/L; 25 °C",
      "nyala_lampu_benar": "terang",
      "gelembung_benar": "banyak",
      "persamaan_reaksi": "NaHCO₃(s) → Na⁺(aq) + HCO₃⁻(aq); HCO₃⁻(aq) + H₂O(l) ⇌ H₂CO₃(aq) + OH⁻(aq)",
      "alasan": "Natrium bikarbonat terdisosiasi menjadi Na⁺ dan HCO₃⁻. Ion bikarbonat juga mengalami kesetimbangan asam-basa dengan air.",
      "catatan_keselamatan_batasan": "Persamaan kedua adalah kesetimbangan tambahan, bukan proses yang mengubah seluruh bikarbonat."
    },
    {
      "id": "H09",
      "nama": "Air berkarbonasi",
      "rumus": "CO₂(aq) ⇌ H₂CO₃",
      "kategori_acuan": "elektrolit_lemah",
      "kondisi_acuan": "Model: CO₂(aq) ⇌ H₂CO₃; 0.010 mol/L; 25 °C",
      "nyala_lampu_benar": "redup",
      "gelembung_benar": "sedikit",
      "persamaan_reaksi": "H₂CO₃(aq) + H₂O(l) ⇌ H₃O⁺(aq) + HCO₃⁻(aq)",
      "alasan": "CO₂ terlarut membentuk sistem asam karbonat lemah yang menghasilkan ion dalam jumlah terbatas.",
      "catatan_keselamatan_batasan": "Minuman berkarbonasi dapat mengandung asam dan garam tambahan; model hanya mengisolasi pengaruh CO₂."
    }
  ]
}
```

## 4. Kontrak data untuk antarmuka

Setiap objek sampel menggunakan struktur yang sama:

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID unik dan stabil |
| `nama` | string | nama tampilan |
| `rumus` | string | rumus kimia / ringkasan komposisi |
| `kategori_acuan` | enum | `elektrolit_kuat`, `elektrolit_lemah`, `nonelektrolit` |
| `kondisi_acuan` | string | konsentrasi/asumsi dan suhu |
| `nyala_lampu_benar` | enum | `terang`, `redup`, `mati` |
| `gelembung_benar` | enum | `banyak`, `sedikit`, `tidak_ada` |
| `persamaan_reaksi` | string | reaksi disosiasi, ionisasi, kesetimbangan, atau pelarutan |
| `alasan` | string | umpan balik konsep setelah pengujian |
| `catatan_keselamatan_batasan` | string | peringatan atau batasan interpretasi; string kosong jika tidak ada catatan khusus |

Jangan memakai `nama` sebagai primary key. Gunakan `id` agar perubahan label tidak merusak lembar kerja lama.

## 5. Aturan alur dan penskoran

### Percobaan 1

Urutan antarmuka:
1. Siswa memilih sampel.
2. Siswa menjalankan saklar simulasi.
3. Sistem menampilkan hasil visual acuan (lampu dan gelembung).
4. Siswa memilih pengamatan lampu, pengamatan gelembung, dan kesimpulan kategori.
5. Sistem menghitung skor dan menyimpan satu rekaman hasil untuk sampel tersebut.

Skor per sampel (maksimum 3):
- 1 poin jika pilihan lampu siswa sama dengan `nyala_lampu_benar`.
- 1 poin jika pilihan gelembung siswa sama dengan `gelembung_benar`.
- 1 poin jika kesimpulan kategori sama dengan `kategori_acuan`.

**Jangan** memberi poin untuk persamaan reaksi atau jawaban uraian.

### Percobaan 2

Urutan antarmuka:
1. Siswa memilih sampel.
2. Siswa memilih prediksi kategori.
3. Siswa mengunci prediksi.
4. Setelah terkunci, prediksi bersifat immutable untuk percobaan tersebut.
5. Siswa menjalankan simulasi.
6. Siswa memilih hasil lampu dan gelembung.
7. Sistem menampilkan kategori acuan, persamaan, serta alasan sebagai umpan balik.

Skor per sampel (maksimum 3):
- 1 poin jika prediksi awal sama dengan `kategori_acuan`.
- 1 poin jika pilihan lampu sama dengan `nyala_lampu_benar`.
- 1 poin jika pilihan gelembung sama dengan `gelembung_benar`.

**Jangan** memberi skor tambahan untuk kesimpulan, persamaan reaksi, atau alasan di Percobaan 2. Prediksi awal harus tetap tersimpan persis seperti jawaban siswa, walaupun salah.

### Fungsi pembanding skor (pseudocode)

```js
const scoreExperiment1 = (sample, answer) => ({
  lampu: Number(answer.lampu === sample.nyala_lampu_benar),
  gelembung: Number(answer.gelembung === sample.gelembung_benar),
  klasifikasi: Number(answer.kategori === sample.kategori_acuan),
  total:
    Number(answer.lampu === sample.nyala_lampu_benar) +
    Number(answer.gelembung === sample.gelembung_benar) +
    Number(answer.kategori === sample.kategori_acuan)
});

const scoreExperiment2 = (sample, answer) => ({
  prediksi: Number(answer.prediksi_awal === sample.kategori_acuan),
  lampu: Number(answer.lampu === sample.nyala_lampu_benar),
  gelembung: Number(answer.gelembung === sample.gelembung_benar),
  total:
    Number(answer.prediksi_awal === sample.kategori_acuan) +
    Number(answer.lampu === sample.nyala_lampu_benar) +
    Number(answer.gelembung === sample.gelembung_benar)
});
```

`Number(boolean)` menghasilkan 1 atau 0. Pseudocode ini adalah aturan penskoran, bukan integrasi ke proyek tertentu.

## 6. Struktur rekaman Lembar Kerja

Simpan satu rekaman per sampel yang telah dikerjakan. Pisahkan jawaban siswa dari data acuan. Contoh struktur:

```json
{
  "worksheet_id": "uuid-lembar-kerja",
  "experiment": "percobaan_2",
  "sample_id": "H02",
  "sample_name_snapshot": "Air cuka",
  "student_response": {
    "prediction_initial": "elektrolit_lemah",
    "prediction_locked": true,
    "lamp_observation": "redup",
    "bubble_observation": "sedikit"
  },
  "reference": {
    "category": "elektrolit_lemah",
    "lamp": "redup",
    "bubbles": "sedikit",
    "reaction": "CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq)",
    "explanation": "Asam asetat hanya terionisasi sebagian dalam air."
  },
  "score": {
    "prediction": 1,
    "lamp": 1,
    "bubbles": 1,
    "total": 3,
    "maximum": 3
  },
  "completed_at": "2026-11-17T00:00:00.000Z"
}
```

Untuk Percobaan 1, gunakan `student_response` dengan field `lamp_observation`, `bubble_observation`, dan `category_conclusion`; skor terdiri dari `lamp`, `bubbles`, `classification`, dan `total`.

Best practices:
- Simpan `sample_id` dan snapshot nama sampel agar rekaman historis tetap terbaca jika label data berubah.
- Simpan prediksi awal dalam field terpisah dan jangan pernah menimpanya dengan kategori acuan.
- Tampilkan tiga panel/label yang berbeda: **Prediksi siswa**, **Hasil pengamatan siswa**, dan **Kesimpulan/penjelasan acuan**.
- Data acuan sebaiknya dibaca dari satu sumber JSON, bukan disalin ke banyak komponen.
- Jika menggunakan penyimpanan browser, `localStorage` cukup untuk prototipe satu perangkat; untuk penggunaan kelas multi-pengguna, gunakan backend dan identitas pengguna sesuai arsitektur aplikasi.
- Simpan skor sebagai hasil turunan dari jawaban dan data acuan; hindari mengedit skor manual.
- Validasi enum dan ID saat data dimuat. Pastikan tidak ada ID duplikat.

## 7. Pemeriksaan integritas dataset

| Pemeriksaan | Hasil yang diharapkan |
|---|---:|
| Percobaan 1 — elektrolit kuat | 10 |
| Percobaan 1 — elektrolit lemah | 10 |
| Percobaan 1 — nonelektrolit | 10 |
| Total Percobaan 1 | 30 |
| Total Percobaan 2 | 9 |
| ID sampel unik lintas percobaan | Ya |
| Nilai lampu valid | `terang`, `redup`, `mati` |
| Nilai gelembung valid | `banyak`, `sedikit`, `tidak_ada` |
| Skor maksimum tiap sampel | 3 |

## 8. Catatan akurasi dan keterbatasan kimia

1. Kuat/lemah menyatakan tingkat pembentukan ion, bukan konsentrasi. Larutan elektrolit kuat yang sangat encer dapat menghantarkan arus lebih kecil daripada larutan elektrolit lemah yang lebih pekat.
2. Garam ionik yang larut umumnya terdisosiasi hampir lengkap. Garam yang sukar larut tidak otomatis menjadi elektrolit lemah: bagian yang larut dapat terdisosiasi hampir lengkap, tetapi jumlah ion totalnya kecil. Dataset baku di sini dipilih dari garam yang larut pada konsentrasi acuan.
3. Air suling bukan benar-benar bebas ion. Autoionisasi air menghasilkan H₃O⁺ dan OH⁻ dalam jumlah sangat kecil; kategori nonelektrolit dipakai sebagai penyederhanaan pembelajaran.
4. Air jeruk, air mineral, dan air keran adalah campuran. Hasil pengukuran nyata bergantung komposisi ion dan konsentrasinya. Kategori dan nyala pada dataset adalah nilai acuan model, bukan hasil pengukuran universal.
5. Gelembung hanya muncul jika reaksi elektrokimia menghasilkan gas pada elektroda dan gas terbentuk cukup cepat untuk terlihat. Disosiasi atau ionisasi dalam larutan bukan penyebab langsung gelembung.
6. Larutan klorida dapat memiliki reaksi anode yang berbeda bergantung konsentrasi, potensial, dan bahan elektroda. Karena itu, jangan menganggap persamaan elektrolisis air sebagai produk universal untuk semua larutan.

## 9. Sumber rujukan untuk verifikasi

1. OpenStax, *Chemistry 2e*, Section 11.2 — Electrolytes. Definisi elektrolit kuat/lemah/nonelektrolit, disosiasi senyawa ionik, dan ionisasi asam/basa:  
   https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes
2. OpenStax, *Chemistry 2e*, Chapter 11 Summary — hubungan larutan, elektrolit, dan kelarutan:  
   https://openstax.org/books/chemistry-2e/pages/11-summary
3. Chemistry LibreTexts, *Electrolysis* — elektrolisis air, reaksi katode/anode, dan pembentukan H₂/O₂:  
   https://chem.libretexts.org/Bookshelves/General_Chemistry/Book%3A_General_Chemistry%3A_Principles_Patterns_and_Applications_(Averill)/19%3A_Electrochemistry/19.08%3A_Electrolysis
4. PubChem, Sodium Chloride — data identitas dan kelarutan NaCl:  
   https://pubchem.ncbi.nlm.nih.gov/compound/5234

**Catatan verifikasi:** sumber OpenStax menjadi dasar utama klasifikasi elektrolit dan konsep kelarutan; LibreTexts menjadi dasar pembedaan ionisasi dari elektrolisis; PubChem digunakan sebagai rujukan data zat spesifik. Untuk implementasi produksi, periksa SDS resmi pemasok dan data kelarutan masing-masing bahan jika komposisi simulasi akan diubah atau dipakai untuk kegiatan laboratorium nyata.
