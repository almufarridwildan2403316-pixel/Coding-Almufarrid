# Desain Teknis KimiaLab

Dokumen ini menggambarkan implementasi yang ada di workspace, bukan rancangan fitur yang belum dibuat. Jalur relatif di bawah berangkat dari root repositori.

## 1. Teknologi dan titik masuk

- React 19 dan TypeScript, dibangun dengan Vite 8; ikon menggunakan `lucide-react`.
- `src/main.tsx` memasang `App` di elemen `#root` dalam `StrictMode` dan memuat stylesheet global.
- `src/App.tsx` mengelola navigasi, identitas, progres, autentikasi, pemuatan/simpan Firebase, serta memilih komponen halaman.
- Firebase diinisialisasi secara kondisional dari variabel `VITE_FIREBASE_*` melalui `src/utils/firebase.ts`. Tanpa konfigurasi wajib, mode tamu tetap tersedia.

## 2. Pemetaan struktur berkas

| Lokasi | Tanggung jawab |
|---|---|
| `src/components/Navbar.tsx` | Menu halaman, progres ringkas, identitas aktif, keluar akun, menu responsif, serta tautan Akses Guru yang ditampilkan untuk role guru. |
| `src/components/Beranda.tsx` | Pertanyaan pemantik yang dapat disimpan dan video YouTube pengantar dengan tautan untuk membuka YouTube langsung. |
| `src/components/Materi.tsx` | Materi konsep dan tautan untuk memulai laboratorium virtual. |
| `src/components/LabVirtual.tsx` | Dua alur percobaan, pilihan sampel, prediksi percobaan 2, saklar dan SVG alat, pengamatan, skor per percobaan, reset. |
| `src/components/LembarKerja.tsx` | Rekap 30 sampel baku dan 10 larutan sehari-hari, detail pengamatan, analisis/kesimpulan umum. |
| `src/components/Evaluasi.tsx` | 10 soal pilihan ganda dan 2 esai, penyimpanan draf kuis lokal, penghitungan nilai pilihan ganda, pembahasan, dan percobaan ulang. |
| `src/components/HasilBelajar.tsx` | Ringkasan progres eksperimen, kesimpulan, nilai dan riwayat evaluasi, serta aksi reset seluruh progres. |
| `src/components/TeacherDashboard.tsx` | Rekap kiriman evaluasi, jawaban esai, nilai esai manual, dan catatan guru. |
| `src/components/Login.tsx` | Login/registrasi email-kata sandi, Google, pemulihan kata sandi, dan lanjut sebagai tamu. |
| `src/components/Footer.tsx` | Footer aplikasi. |
| `src/components/HeroMiniLab.tsx` | Komponen visual mini-lab. |
| `src/data/larutanData.ts` dan `src/data/larutan.md` | Dataset percobaan dibaca dari blok JSON di Markdown, divalidasi, dipetakan menjadi sampel untuk UI. Dataset berisi 30 sampel Percobaan 1 dan 10 sampel Percobaan 2; kategori Percobaan 1 seimbang 10/10/10. |
| `src/data/solutionsData.ts` | Katalog enam larutan dasar terpisah; `App` dan `LabVirtual` menggunakan dataset `larutanData.ts` untuk alur eksperimen yang sekarang. |
| `src/utils/experimentRecords.ts` | Kunci catatan per kombinasi percobaan/sampel dan aturan skor maksimal 3 komponen per sampel. |
| `src/utils/storage.ts` | Skema progres, kunci dan validasi localStorage, draf/riwayat kuis, operasi Firestore, dan reset progres. |
| `src/utils/firebase.ts` | Inisialisasi Firebase Auth dan Firestore jika variabel konfigurasi wajib tersedia. |
| `firebase/firestore.rules` | Aturan akses profil, progres pribadi, riwayat percobaan, dan perubahan nilai/catatan oleh guru. |
| `src/types/chemistry.ts` | Tipe halaman, sampel, catatan praktikum, identitas, progres, draf, hasil, dan kiriman kuis. |

## 3. Navigasi halaman

Navigasi adalah **state-based navigation**, bukan router berbasis URL. `activePage` di `App.tsx` memilih satu dari tujuh halaman:

1. `beranda` — Beranda
2. `materi` — Materi Konsep
3. `lab` — Laboratorium Virtual
4. `lembar-kerja` — Lembar Kerja
5. `evaluasi` — Evaluasi
6. `guru` — Akses Guru
7. `hasil` — Hasil Belajar

Pilihan halaman tidak membentuk path/riwayat URL tersendiri. Halaman Guru dibatasi oleh role pada UI; `App` merender Beranda jika state halaman Guru dipilih oleh pengguna non-guru. Karena itu hosting harus mengirimkan `index.html` untuk route aplikasi (SPA fallback/rewrite), khususnya bila konfigurasi hosting lain kelak menambahkan URL dalam aplikasi. Contoh konfigurasi yang umum: Vercel rewrite seluruh path ke `/`, Netlify `_redirects` berisi `/* /index.html 200`. Uji URL produksi aktual tetap diperlukan.

## 4. Alur data dan penyimpanan

1. `src/data/larutan.md` menyediakan blok JSON. `larutanData.ts` mem-parse dan memvalidasi isi, memetakan kategori/lampu/gelembung, lalu mengekspornya sebagai `EXPERIMENT_SAMPLES`.
2. Komponen halaman menampilkan data dan menyusun tindakan pengguna. `App.tsx` meneruskan progres ke komponen dan menerima catatan melalui handler.
3. Progres tersimpan di localStorage dengan key dasar `kimialab_learning_progress_v2`. Ruang lingkup akun menggunakan UID; ruang lingkup tamu menggunakan nama dan kelas yang dinormalisasi. Draf kuis disimpan terpisah dan juga dibedakan menurut identitas/ID kuis.
4. Bentuk inti `LearningProgress` mencakup `testedSolutions`, `worksheetRecords`, `worksheetConclusion`, `homePromptResponse`, `quizResult`, `quizSubmissions`, dan `readMaterials`. Catatan sampel menggunakan kunci `experimentId:sampleId`.
5. Catatan LKPD berisi identitas sampel/kondisi, prediksi dan status terkuncinya, pengamatan lampu/gelembung, kesimpulan, acuan kimia, skor, status selesai, dan waktu selesai. Kesimpulan umum disimpan terpisah.
6. Hasil evaluasi memuat ID percobaan, skor PG, jumlah benar/jumlah soal, jawaban 10 PG dan 2 esai, waktu kirim, dan nomor percobaan. Jawaban esai ditampilkan untuk penilaian manual; nilai/catatan guru adalah kolom terpisah, bukan bagian dari skor otomatis PG.
7. Untuk akun terautentikasi, progres disimpan ke `studentProgress/{uid}` (field `progress`, `updatedAt`). Riwayat kuis juga memakai subkoleksi `studentProgress/{uid}/quizAttempts/{attemptId}` dan counter `quizAttemptCounters`. Dokumen `users/{uid}` dengan `role: "teacher"` menjadi sumber role guru. Aturan akses server tetap menentukan apakah operasi diizinkan.

Sinkronisasi progres akun dijadwalkan setelah perubahan dan kegagalan ditampilkan sebagai peringatan; aplikasi berusaha mempertahankan cache perangkat. Saat memuat akun, data lokal dan server dapat digabung untuk perubahan yang terdeteksi selama pemuatan. Audit mencatat risiko perubahan lokal tertimpa saat sesi berganti/logout-login dan tidak adanya tombol retry umum; rekonsiliasi lintas sesi tetap perlu diuji.

## 5. Perilaku dan batasan saat ini

- Evaluasi terdiri dari 10 pilihan ganda × 10 poin (skor otomatis maksimum 100), serta 2 esai yang membutuhkan penilaian manual. Esai tidak menambah skor otomatis yang ditampilkan.
- Draf kuis di kode sekarang ditulis ke localStorage ketika pilihan PG/esai berubah, dipulihkan saat komponen dimuat, dan menampilkan pesan kegagalan penyimpanan. Hasil terkirim memiliki jalur coba simpan kembali. Temuan audit AD10-04/05 tetap tercatat terbuka sesuai status audit, namun harus diuji ulang pada workspace ini sebelum dinyatakan sebagai bug yang masih terjadi.
- Setelah hasil tersimpan, tombol Ulangi Kuis membuat ID percobaan baru. Temuan audit AD10-03 tetap membutuhkan verifikasi lintas akun/perangkat/Firestore.
- Percobaan 2 meminta prediksi dikunci sebelum saklar ON. Reset lab saat ini mengosongkan prediksi, pengamatan, skor, status pemeriksaan, dan catatan tersimpan untuk sampel itu; AD10-06 dari audit masih perlu uji ulang.
- `getStoredProgress` menangani JSON progres yang tidak dapat dibaca dengan mencatat error di console dan mengembalikan progres default. Draf kuis rusak menghasilkan pesan pemulihan pada halaman Evaluasi. Kapasitas penuh/penolakan tulis localStorage perlu diperiksa sebagai jalur kegagalan, tidak dianggap sebagai tes lulus.
- Kontrol menggunakan elemen tombol, select, textarea dan label native, sehingga dapat dijelajahi dengan keyboard/browser. Tidak ditemukan shortcut keyboard khusus aplikasi; aksesibilitas keyboard/fokus perlu diuji manual.
- Simulasi adalah model visual kualitatif, bukan pengukuran konduktivitas. UI menampilkan parameter alat 6 V DC, 10 detik, 100 mL, 25 °C, dan jarak elektroda 2 cm. Konsentrasi acuan ada per sampel di dataset dan tidak semuanya 0.050 mol/L; jangan menyamaratakan kondisi sampel.
- Video Beranda adalah embed YouTube dengan tautan langsung ke YouTube. Tidak ada berkas video fallback lokal yang ditemukan; materi/pertanyaan pemantik tersedia di aplikasi, tetapi fallback khusus saat embed gagal perlu ditentukan/dibuat.
- Daftar tujuh temuan AD10 pada backlog adalah status yang diminta dari catatan audit, bukan hasil uji ulang pada HEAD saat dokumentasi ini disusun. Beberapa perilaku pada sumber tampak sudah memiliki kode penanganan; semua status harus diperbarui hanya setelah bukti uji tercatat.

## 6. Deploy

Build produksi menggunakan `npm run build`, dengan keluaran Vite di `dist/`. Deploy perlu mengatur variabel Firebase di lingkungan hosting, mengaktifkan provider Auth yang dipakai, menerapkan `firebase/firestore.rules`, menyiapkan dokumen role guru jika dibutuhkan, dan memastikan fallback SPA. Jangan masukkan kredensial admin/service account ke frontend atau dokumentasi.
