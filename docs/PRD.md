Berikut PRD KimiaLab yang sudah disesuaikan dengan pilihanmu: website pembelajaran interaktif, target siswa SMA kelas X, fokus utama simulasi praktikum, dan desain modern. Dokumen ini dibuat lebih spesifik agar bisa langsung dijadikan acuan oleh developer atau AI coding tool untuk membangun website.

# PRD KimiaLab — Versi 1.0

[Conductivity Testing: Investigating conductivity and its practical applications | Labster Virtual Labs](https://images.openai.com/static-rsc-4/g4hRj5Kxfwb3m6de2V-SvVTAMquHGOq8EOVCSvkxevT29sQHV0w-_xaJih7RQ6c86-tsJlH3Of85ogVdEJOc0uFLFJcrgsaKmYK81tOydXTNFQKUQBBDlqmxv3HePRtVMCI05GPcpn-YpjvAPi3K-VLYToOJsIejOtx0Gk_R_AE?purpose=inline)

[labster.com](https://www.labster.com/simulations/conductivity-testing-investigating-conductivity-and-its-practical-applications?utm_source=chatgpt.com)

# KimiaLab: Virtual Electrolyte Laboratory

Product Requirements Document · 20 Oktober 2026

Status dokumen

Draft siap dikembangkan

Platform

Web responsif

Pengguna utama

Siswa SMA kelas X

Fitur inti

Simulasi praktikum virtual

Bahasa

Bahasa Indonesia

## 1. Ringkasan produk

KimiaLab adalah website pembelajaran kimia interaktif yang memungkinkan siswa melakukan praktikum virtual untuk menyelidiki kemampuan larutan dalam menghantarkan arus listrik.

Siswa tidak hanya membaca materi, tetapi juga dapat memilih larutan, menggunakan alat uji daya hantar listrik virtual, mengamati kondisi lampu dan gelembung pada elektroda, mencatat hasil pengamatan, serta menyimpulkan apakah larutan termasuk elektrolit kuat, elektrolit lemah, atau non-elektrolit.

Nilai utama produk: siswa dapat menghubungkan fenomena eksperimen yang terlihat dengan penjelasan mikroskopis mengenai ion-ion yang bergerak dalam larutan.

## 2. Masalah yang ingin diselesaikan

- Siswa sulit membayangkan keberadaan ion dalam larutan karena ion tidak dapat diamati langsung dengan mata.
- Pembelajaran yang hanya menggunakan teks dan rumus membuat perbedaan ketiga jenis larutan terasa abstrak.
- Tidak semua sekolah memiliki waktu, peralatan, atau bahan yang cukup untuk melakukan praktikum berulang.
- Siswa membutuhkan kesempatan untuk mencoba, membuat prediksi, menguji, dan memperbaiki pemahaman berdasarkan hasil pengamatan.

KimiaLab menjawab masalah tersebut melalui simulasi yang dapat diulang, visualisasi partikel, dan umpan balik pembelajaran.

## 3. Tujuan dan indikator keberhasilan

| Tujuan                               | Indikator yang diukur                                                     |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Meningkatkan pemahaman konsep        | Siswa mampu membedakan tiga kategori larutan dan menjelaskan alasannya.   |
| Melatih keterampilan ilmiah          | Siswa mampu membuat prediksi, mengamati, mencatat data, dan menyimpulkan. |
| Memvisualisasikan konsep mikroskopis | Siswa mampu menghubungkan jumlah ion bergerak dengan daya hantar listrik. |
| Mendukung belajar mandiri            | Siswa dapat menyelesaikan simulasi tanpa bantuan teknis dari guru.        |
| Memberikan evaluasi langsung         | Siswa menerima skor dan pembahasan setelah menyelesaikan kuis.            |

Target awal untuk uji coba: setidaknya 80% siswa yang mengikuti pengujian dapat menyelesaikan simulasi dan menjawab pertanyaan interpretasi hasil dengan benar. Angka ini merupakan sasaran evaluasi, bukan hasil yang sudah dicapai.

## 4. Target pengguna dan skenario penggunaan

Persona utama: siswa SMA kelas X yang mempelajari materi larutan elektrolit dan non-elektrolit.

Skenario penggunaan utama:

1. Siswa membuka website dan membaca tujuan pembelajaran.
2. Siswa mempelajari pengantar singkat tentang larutan dan ion.
3. Siswa masuk ke laboratorium virtual dan memilih sampel larutan.
4. Siswa memprediksi hasil sebelum menjalankan eksperimen.
5. Siswa menjalankan simulasi dan mengamati indikator alat.
6. Siswa mencatat hasil ke tabel pengamatan.
7. Siswa menjawab pertanyaan analisis dan membuat kesimpulan.
8. Siswa mengerjakan kuis untuk menguji pemahaman.

Guru berperan sebagai pengguna pendukung yang dapat menggunakan website untuk demonstrasi di kelas.

## 5. Ruang lingkup dan prioritas fitur

Pengembangan dibagi menjadi fitur wajib untuk versi pertama dan fitur lanjutan agar website dapat selesai tanpa kehilangan fungsi pembelajaran utamanya.

### P0 — Wajib pada MVP

Fitur yang harus selesai agar produk dapat digunakan.

- Beranda dan navigasi materi.
- Materi dasar larutan elektrolit dan non-elektrolit.
- Simulasi uji daya hantar listrik.
- Prediksi, pengamatan, tabel data, dan kesimpulan.
- Visualisasi ion dalam larutan.
- Kuis, skor, dan pembahasan.
- Progres belajar sederhana.
- Desain responsif desktop dan ponsel.

### P1 — Pengembangan berikutnya

Fitur yang meningkatkan pengalaman belajar.

- Variasi konsentrasi larutan.
- Mode tantangan atau investigasi mandiri.
- Riwayat percobaan dan ekspor hasil.
- Login siswa dan dashboard guru.
- Penyimpanan nilai lintas perangkat.

## 6. Struktur halaman website

Website menggunakan navigasi sederhana agar siswa dapat langsung menemukan laboratorium virtual.

01\. Beranda

Pengenalan KimiaLab, tujuan pembelajaran, progres, dan tombol “Mulai Praktikum”.

02\. Materi

Konsep larutan, ion, daya hantar listrik, klasifikasi larutan, serta contoh persamaan reaksi.

03\. Laboratorium Virtual

Area eksperimen utama dengan pilihan sampel, alat uji, tombol eksperimen, dan hasil pengamatan.

04\. Lembar Kerja Praktikum

Kolom prediksi, tabel pengamatan, analisis hasil, dan kesimpulan siswa.

05\. Evaluasi

Kuis konsep, interpretasi data eksperimen, skor, dan pembahasan jawaban.

06\. Hasil Belajar

Status penyelesaian, ringkasan hasil percobaan, dan nilai kuis.

## 7. Spesifikasi fitur utama: Laboratorium Virtual

Bagian ini merupakan persyaratan terpenting dalam PRD karena menjadi pusat pengalaman belajar KimiaLab.

### 7.1 Tata letak laboratorium

Pada layar desktop, halaman simulasi dibagi menjadi tiga area.

KimiaLab / Laboratorium Virtual

A. Panel eksperimen

[Electrolysis of water with battery and bulb on white background. Strong electrolyte burn a light bulb.](https://images.openai.com/static-rsc-4/Vhpr-HaLD_pqL0a9I1ruFujf2ZGkcPlnj1LrzzmAsn7n6jmJjvnT151F4EJbjkkvWlciSC1DL_clR_awJsfkmfqzRIXzwbWeX6fPhIIndpc-t_IHS1VMWlghmLdm51_Mj2tlb6A0LGeiE65ViDtTtSv3GK-uAgS-QoOo173cleOI1Cgb8fFE28Td8Tv80E5D?purpose=inline)

Beaker, elektroda, rangkaian, dan indikator lampu.

B. Panel kontrol

Sampel larutan

Pilih sampel

Mulai pengujian

Ulangi percobaan

C. Panel hasil dan analisis

Nyala lampu

Gelembung

Partikel ion

Sketsa struktur antarmuka, bukan tampilan final aplikasi.

Pada ponsel, ketiga area disusun secara vertikal. Kontrol harus tetap mudah dijangkau dan tabel pengamatan tidak boleh terpotong.

### 7.2 Sampel larutan yang tersedia

Versi MVP menyediakan enam sampel utama.

| ID  | Sampel          | Kategori yang diharapkan | Fenomena utama                                                                   |
| --- | --------------- | ------------------------ | -------------------------------------------------------------------------------- |
| S01 | NaCl(aq)        | Elektrolit kuat          | Ion Na⁺ dan Cl⁻ terbentuk melalui disosiasi.                                     |
| S02 | HCl(aq)         | Elektrolit kuat          | Terbentuk ion H₃O⁺ dan Cl⁻ dalam air.                                            |
| S03 | CH₃COOH(aq)     | Elektrolit lemah         | Sebagian molekul membentuk ion.                                                  |
| S04 | NH₃(aq)         | Elektrolit lemah         | Sebagian NH₃ bereaksi dengan air membentuk NH₄⁺ dan OH⁻.                         |
| S05 | Larutan sukrosa | Non-elektrolit           | Molekul sukrosa terlarut tanpa membentuk ion secara berarti.                     |
| S06 | Larutan etanol  | Non-elektrolit           | Etanol terlarut sebagai molekul dan tidak menghasilkan ion dalam jumlah berarti. |

Seluruh sampel merupakan model pembelajaran. Penggunaan larutan asam atau basa dalam praktikum nyata memerlukan prosedur keselamatan yang sesuai.

### 7.3 Alur eksperimen

1. Persiapan. Siswa masuk ke laboratorium dan membaca tujuan serta petunjuk singkat.
2. Prediksi. Sebelum pengujian, siswa memperkirakan kategori larutan dan kondisi lampu.
3. Pemilihan sampel. Siswa memilih satu larutan yang tersedia.
4. Pengujian. Siswa menjalankan tombol “Mulai Pengujian” untuk mengaktifkan rangkaian virtual.
5. Pengamatan. Sistem menampilkan kondisi lampu, gelembung pada elektroda, dan representasi partikel di dalam larutan.
6. Pencatatan. Siswa memasukkan hasil ke tabel pengamatan.
7. Analisis. Siswa menjawab pertanyaan tentang hubungan hasil pengamatan dengan keberadaan ion.
8. Kesimpulan. Sistem memberikan umpan balik setelah siswa menyelesaikan analisis.

### 7.4 Aturan perilaku simulasi

Developer harus menerapkan aturan berikut agar hasil simulasi konsisten.

| Kondisi           | Perilaku sistem                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Belum ada sampel  | Tombol pengujian dinonaktifkan atau sistem meminta siswa memilih sampel.                                                                      |
| Sampel dipilih    | Informasi identitas sampel ditampilkan tanpa langsung membocorkan seluruh kesimpulan.                                                         |
| Pengujian dimulai | Animasi arus listrik, lampu, dan partikel aktif.                                                                                              |
| Elektrolit kuat   | Lampu ditampilkan terang pada kondisi simulasi standar; visualisasi menunjukkan ion-ion bergerak.                                             |
| Elektrolit lemah  | Lampu ditampilkan redup pada kondisi simulasi standar; visualisasi menunjukkan lebih sedikit ion dibandingkan molekul yang belum terionisasi. |
| Non-elektrolit    | Lampu tidak menyala; visualisasi menunjukkan molekul netral tanpa ion hasil ionisasi zat terlarut yang berarti.                               |
| Pengujian selesai | Hasil pengamatan dapat dicatat dan dianalisis.                                                                                                |
| Pengujian diulang | Animasi dan kondisi eksperimen diatur ulang.                                                                                                  |
| Sampel diganti    | Hasil pengujian sebelumnya tidak boleh salah ditampilkan sebagai hasil sampel baru.                                                           |

Ketentuan ilmiah: kondisi lampu di atas berlaku untuk sampel dan kondisi standar yang ditetapkan dalam simulasi. Terang lampu bukan ukuran universal kekuatan elektrolit karena juga dipengaruhi konsentrasi, mobilitas ion, suhu, dan alat. Gelembung bergantung pada reaksi elektroda dan tidak harus selalu terlihat jelas pada setiap kondisi.

### 7.5 Visualisasi partikel

Simulasi harus memperlihatkan hubungan antara model mikroskopis dan hasil pengamatan makroskopis.

- Elektrolit kuat: banyak ion terlarut yang bergerak bebas.
- Elektrolit lemah: campuran molekul netral dan ion, dengan ion yang terbentuk melalui ionisasi sebagian.
- Non-elektrolit: molekul netral yang tersebar di dalam air tanpa pembentukan ion berarti dari zat terlarut.

Animasi partikel harus membedakan ion positif, ion negatif, dan molekul netral melalui bentuk, label, atau warna sekaligus. Pergerakan partikel tidak boleh menyiratkan bahwa ion bergerak satu arah secara permanen; gerak acak tetap terjadi, sedangkan medan listrik menyebabkan perpindahan bersih ion.

## 8. Persyaratan fungsional terperinci

Setiap fitur harus memiliki ID, perilaku yang jelas, dan kriteria penerimaan supaya developer dapat mengetahui kapan pekerjaan dinyatakan selesai.

| ID    | Persyaratan          | Kriteria penerimaan                                                       |
| ----- | -------------------- | ------------------------------------------------------------------------- |
| FR-01 | Navigasi halaman     | Semua menu utama dapat dibuka dan tidak menghasilkan halaman kosong.      |
| FR-02 | Materi pembelajaran  | Materi, ilustrasi, dan persamaan kimia ditampilkan dengan benar.          |
| FR-03 | Pemilihan sampel     | Siswa dapat memilih keenam sampel yang tersedia.                          |
| FR-04 | Prediksi siswa       | Siswa dapat memasukkan prediksi sebelum pengujian.                        |
| FR-05 | Simulasi eksperimen  | Tombol pengujian menjalankan animasi dan menampilkan hasil sesuai sampel. |
| FR-06 | Visualisasi partikel | Jenis dan proporsi relatif partikel sesuai model kimia sampel.            |
| FR-07 | Lembar kerja         | Hasil pengamatan dapat dicatat dalam tabel.                               |
| FR-08 | Analisis hasil       | Sistem memberikan umpan balik atas jawaban analisis siswa.                |
| FR-09 | Kuis                 | Jawaban diperiksa otomatis dan skor dihitung dengan benar.                |
| FR-10 | Progres              | Status materi dan hasil aktivitas diperbarui setelah kegiatan selesai.    |
| FR-11 | Reset eksperimen     | Siswa dapat mengulang pengujian tanpa membawa hasil sampel sebelumnya.    |
| FR-12 | Responsivitas        | Semua fitur utama dapat digunakan pada desktop dan ponsel.                |

## 9. Rancangan desain UI/UX

KimiaLab harus memiliki tampilan modern dan profesional, dengan nuansa laboratorium sains tetapi tetap ramah bagi siswa SMA.

Warna utama — Teal dan navy

Teal untuk tindakan utama dan identitas sains; navy untuk teks dan navigasi; latar putih atau abu-abu muda untuk keterbacaan.

Layout berbasis kartu

Setiap materi, sampel, hasil, dan kuis menggunakan kartu dengan judul dan informasi yang jelas.

Interaksi yang jelas

Tombol memiliki label spesifik seperti “Mulai Pengujian”, “Catat Hasil”, dan “Lihat Pembahasan”.

Responsif dan mudah diakses

Ukuran teks nyaman dibaca, kontrol mudah disentuh, dan indikator tidak hanya mengandalkan warna.

### Prinsip pengalaman pengguna

1. Siswa harus dapat memulai simulasi dalam maksimal tiga langkah dari beranda.
2. Petunjuk eksperimen disampaikan singkat dan bertahap.
3. Jawaban tidak langsung ditampilkan sebelum siswa mencoba, kecuali pada mode belajar atau pembahasan.
4. Kesalahan siswa digunakan sebagai kesempatan belajar melalui umpan balik yang menjelaskan alasannya.
5. Animasi tidak boleh menghambat akses terhadap informasi atau membuat halaman terasa lambat.

## 10. Spesifikasi materi dan evaluasi

### Tujuan pembelajaran

Setelah menggunakan KimiaLab, siswa diharapkan mampu:

- Menjelaskan hubungan ion bergerak dengan kemampuan larutan menghantarkan listrik.
- Membedakan elektrolit kuat, elektrolit lemah, dan non-elektrolit.
- Menafsirkan hasil uji daya hantar listrik.
- Menuliskan persamaan disosiasi atau ionisasi sederhana.
- Menarik kesimpulan berdasarkan bukti eksperimen.

### Bentuk evaluasi

| Jenis soal        | Kemampuan yang diukur | Contoh aktivitas                                                           |
| ----------------- | --------------------- | -------------------------------------------------------------------------- |
| Pemahaman konsep  | Menjelaskan           | Mengapa larutan NaCl dapat menghantarkan listrik?                          |
| Klasifikasi       | Mengidentifikasi      | Menentukan kategori larutan dari hasil uji.                                |
| Interpretasi data | Menganalisis          | Membandingkan hasil dua sampel berdasarkan pengamatan.                     |
| Penalaran         | Mengevaluasi          | Menilai apakah nyala lampu saja cukup untuk menyimpulkan jenis elektrolit. |
| Penerapan         | Menyimpulkan          | Menentukan bukti tambahan yang diperlukan untuk menguji suatu larutan.     |

Kuis MVP disarankan memiliki 10 soal dengan skor maksimal 100. Setiap soal bernilai 10 poin, dan pembahasan ditampilkan setelah jawaban dikirim. Siswa dapat mengulang kuis untuk memperbaiki pemahamannya.

## 11. Arsitektur teknis

Untuk mempercepat pengembangan, versi pertama tidak perlu memakai backend yang kompleks.

Frontend Web

React + TypeScript

Mesin simulasi

JavaScript, SVG atau Canvas untuk animasi

Mesin evaluasi

Pemeriksaan jawaban dan perhitungan skor

Penyimpanan lokal

Local storage untuk progres versi MVP

### Rekomendasi implementasi

| Komponen    | Teknologi           | Fungsi                                            |
| ----------- | ------------------- | ------------------------------------------------- |
| Framework   | React + TypeScript  | Struktur halaman dan komponen antarmuka.          |
| Styling     | Tailwind CSS        | Desain responsif dan konsistensi tampilan.        |
| Animasi     | CSS dan SVG         | Gerak partikel, indikator lampu, serta gelembung. |
| Grafik      | SVG atau Canvas     | Visualisasi alat dan partikel.                    |
| Penyimpanan | Local storage       | Menyimpan progres pada perangkat yang sama.       |
| Hosting     | Vercel atau Netlify | Publikasi website.                                |

Login, database online, dan dashboard guru tidak diperlukan untuk MVP. Jika kelak ditambahkan, data siswa dan hasil belajar perlu dikelola dengan kontrol akses yang sesuai.

## 12. Model data yang diperlukan

Data berikut dapat digunakan sebagai struktur awal implementasi.

Contoh struktur konseptual untuk developer, bukan data hasil eksperimen.

```
type SolutionCategory =
  | "strong_electrolyte"
  | "weak_electrolyte"
  | "nonelectrolyte";

type Solution = {
  id: string;
  name: string;
  formula: string;
  category: SolutionCategory;
  expectedLamp: "bright" | "dim" | "off";
  expectedBubbles: "visible" | "possible" | "not_expected";
  particleModel: string;
  explanation: string;
};

type ExperimentRecord = {
  solutionId: string;
  prediction: string;
  lampObservation: string;
  bubbleObservation: string;
  conclusion: string;
  completed: boolean;
};

type QuizResult = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
};
```

Developer harus menyediakan data sampel dalam konfigurasi terpisah dari komponen tampilan. Dengan demikian, penambahan sampel baru tidak mengharuskan penulisan ulang seluruh halaman.

## 13. Persyaratan nonfungsional

| Aspek          | Ketentuan                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Performa       | Target awal pemuatan halaman utama maksimal 3 detik pada kondisi pengujian yang ditentukan.              |
| Kompatibilitas | Mendukung versi terbaru browser Chrome, Edge, Firefox, dan Safari.                                       |
| Responsivitas  | Dapat digunakan pada resolusi desktop, tablet, dan ponsel.                                               |
| Aksesibilitas  | Navigasi keyboard, label kontrol, kontras memadai, dan indikator yang tidak hanya bergantung pada warna. |
| Keandalan      | Tidak terjadi kesalahan pada pergantian sampel, pengulangan eksperimen, atau penghitungan skor.          |
| Akurasi        | Seluruh konten kimia dan aturan simulasi ditinjau sebelum dirilis.                                       |
| Privasi        | MVP tidak meminta informasi pribadi yang tidak dibutuhkan.                                               |

## 14. Acceptance criteria dan rencana pengujian

Sebelum website dipublikasikan, developer harus menguji seluruh skenario utama.

## Checklist pengujian

10/10 selesai

Navigasi

Semua halaman dapat dibuka dan kembali ke beranda.

Enam sampel

Setiap sampel menampilkan identitas dan kategori yang benar.

Prediksi

Siswa dapat menyimpan prediksi sebelum menjalankan pengujian.

Hasil simulasi

Lampu dan partikel menampilkan kondisi sesuai konfigurasi sampel.

Ganti dan ulangi sampel

Tidak ada hasil eksperimen lama yang tertinggal secara keliru.

Tabel pengamatan

Hasil yang dicatat sesuai dengan hasil simulasi.

Kuis

Skor benar untuk semua kombinasi jawaban yang diuji.

Progres

Status belajar tetap benar setelah halaman dimuat ulang.

Responsivitas

Kontrol simulasi dapat digunakan di desktop dan ponsel.

Akurasi ilmiah

Persamaan, klasifikasi, dan penjelasan diperiksa oleh penelaah kimia.

Salin checklist pengujian

## 15. Tahapan pengembangan

Berikut estimasi awal untuk satu developer yang sudah memahami teknologi yang digunakan.

| Tahap                    | Pekerjaan                                      | Estimasi |
| ------------------------ | ---------------------------------------------- | -------- |
| 1. Fondasi               | Setup proyek, navigasi, dan sistem desain      | 1–2 hari |
| 2. Materi                | Pembuatan halaman dan konten pembelajaran      | 2–3 hari |
| 3. Simulasi              | Alat virtual, logika sampel, animasi partikel  | 3–5 hari |
| 4. Lembar kerja dan kuis | Pencatatan hasil, evaluasi, dan skor           | 2–3 hari |
| 5. Integrasi             | Progres, responsivitas, dan perbaikan tampilan | 1–2 hari |
| 6. Pengujian             | Uji fungsi, validasi kimia, dan perbaikan      | 2–3 hari |

Total estimasi: sekitar 11–18 hari kerja, bergantung pada kompleksitas visualisasi dan pengalaman developer. Estimasi ini belum termasuk pengembangan login, backend, atau dashboard guru.

## 16. Hal yang tidak termasuk dalam MVP

Untuk menjaga fokus pengembangan, versi pertama tidak mencakup:

- Laboratorium fisik yang terhubung dengan sensor nyata.
- Pengukuran konduktivitas listrik secara eksperimental.
- AI tutor berbasis model bahasa.
- Sistem kelas dan manajemen tugas guru.
- Analitik hasil belajar lintas sekolah.
- Akun dan penyimpanan data siswa di server.

Semua fitur tersebut dapat dipertimbangkan setelah simulasi inti berhasil digunakan dan diuji.

## 17. Definition of Done

KimiaLab versi 1.0 dinyatakan selesai ketika:

1. Semua halaman utama dan materi tersedia.
2. Enam sampel dapat diuji dalam laboratorium virtual.
3. Hasil pengamatan, visualisasi partikel, dan penjelasan kimia saling konsisten.
4. Siswa dapat membuat prediksi, mencatat hasil, menganalisis, dan menyimpulkan.
5. Kuis menghitung skor dengan benar dan memberikan pembahasan.
6. Progres dapat tersimpan pada perangkat untuk penggunaan berikutnya.
7. Website lolos checklist pengujian dan validasi konten.
8. Website dapat diakses melalui alamat hosting yang telah dipublikasikan.

## 18. Prompt implementasi untuk AI coding tool

Bagian ini dapat langsung disalin ke coding assistant untuk mulai membangun website berdasarkan PRD.

# Build KimiaLab — Interactive Chemistry Learning Website

Build a complete, responsive Indonesian-language chemistry learning website called **KimiaLab: Virtual Electrolyte Laboratory**.

## Target users

Grade 10 Indonesian high school students studying electrolyte and non-electrolyte solutions.

## Technology

- React + TypeScript
- Tailwind CSS
- SVG/CSS animations for the virtual laboratory
- Local storage for learning progress
- No backend or login required for the MVP

## Main pages

1. Home dashboard
2. Learning materials
3. Virtual laboratory
4. Experiment worksheet
5. Interactive quiz
6. Learning results

## Core laboratory functionality

Provide six solution samples:

- NaCl(aq): strong electrolyte
- HCl(aq): strong electrolyte
- CH3COOH(aq): weak electrolyte
- NH3(aq): weak electrolyte
- Sucrose solution: non-electrolyte
- Ethanol solution: non-electrolyte

Students must be able to:

1. Select a sample.
2. Predict its conductivity before testing.
3. Start and reset the virtual experiment.
4. Observe the lamp, electrode bubbles, and particle visualization.
5. Record observations in a worksheet.
6. Analyze results and submit a conclusion.

Represent strong electrolytes with abundant mobile ions, weak electrolytes with both neutral molecules and ions, and non-electrolytes with neutral dissolved molecules. Use consistent sample-specific simulation rules. Do not present simulated results as real experimental measurements.

## Quiz

Create 10 multiple-choice questions covering concepts, classification, interpretation of experimental data, chemical equations, and evidence-based reasoning. Each question is worth 10 points. Show the score, correct answers, and explanations after submission.

## UI/UX

Use a modern, clean science-laboratory aesthetic with teal, navy, white, and light neutral backgrounds. Use clear typography, reusable cards, simple navigation, and accessible controls. Make the virtual laboratory the main visual focus. Support desktop, tablet, and mobile layouts.

## Requirements

- All buttons and navigation must work.
- Separate chemistry data from UI components.
- Include empty, loading, selected, tested, and error states where applicable.
- Reset previous results when changing samples.
- Save progress locally.
- Validate chemical equations and classifications.
- Avoid placeholder buttons, broken links, and fabricated experimental measurements.
- Include sample data, meaningful explanations, and a README with setup and run instructions.

Implement the MVP end-to-end, test the main user flows, and ensure the project runs successfully before declaring it complete.

Rekomendasi akhir: bangun terlebih dahulu laboratorium virtual yang benar-benar berfungsi, bukan hanya halaman yang terlihat menarik. Keunggulan utama KimiaLab adalah siswa dapat melakukan penyelidikan, mengamati bukti, dan menjelaskan mengapa larutan yang berbeda mempunyai kemampuan menghantarkan listrik yang berbeda.