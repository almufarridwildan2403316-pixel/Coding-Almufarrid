# KimiaLab — Laboratorium Virtual Elektrolit

KimiaLab adalah media pembelajaran kimia berbahasa Indonesia untuk siswa SMA kelas X. Aplikasi membantu siswa mempelajari larutan elektrolit dan nonelektrolit melalui materi konsep, laboratorium virtual, lembar kerja, dan evaluasi.

## Tujuan dan sasaran pengguna

KimiaLab mengajak siswa membuat prediksi, mengamati model nyala lampu dan gelembung, mencatat bukti, lalu menghubungkan hasil dengan ion atau molekul dalam larutan. Guru dapat meninjau kiriman evaluasi dan memberi nilai/catatan esai melalui Akses Guru.

Hasil laboratorium adalah **simulasi kualitatif**, bukan pengukuran eksperimen nyata. Gelembung merupakan bagian dari model visual dan tidak dihitung sebagai hasil elektrolisis kuantitatif.

## Status produk saat ini

- Navigasi state-based mencakup Beranda, Materi Konsep, Laboratorium Virtual, Lembar Kerja, Evaluasi, Akses Guru, dan Hasil Belajar.
- Laboratorium memiliki Percobaan 1 (sampel baku) dan Percobaan 2 (larutan sehari-hari). Dataset memuat 30 sampel dan 10 sampel; prediksi Percobaan 2 dikunci sebelum saklar dapat dinyalakan.
- Evaluasi berisi 10 soal pilihan ganda dan 2 esai. Nilai otomatis adalah 10 × 10 poin untuk PG; esai memerlukan penilaian manual.
- Tamu menyimpan progres di browser. Akun Firebase dapat menggunakan Google atau email/kata sandi dan sinkronisasi Cloud Firestore bila dikonfigurasi.
- Catatan audit AD10-01 s.d. AD10-07 dicantumkan sebagai terbuka sesuai status audit yang diminta. Sebagian alur pada sumber saat ini tampak memiliki penanganan terkait; semua temuan harus diuji ulang sebelum statusnya ditutup atau dinyatakan masih terjadi.

## Menjalankan secara lokal

Persyaratan: Node.js/npm yang kompatibel dengan versi Vite di project dan koneksi internet untuk mengambil dependency.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Isi konfigurasi Firebase pada `.env.local` bila ingin menguji autentikasi dan sinkronisasi. Tanpa konfigurasi Firebase, aplikasi dapat digunakan sebagai tamu. Jangan menaruh service-account key, kredensial admin, atau token privat di frontend maupun repo.

Server Vite biasanya menampilkan alamat lokal, umumnya `http://localhost:5173`; gunakan alamat yang benar-benar dicetak oleh perintah dev.

## Build dan preview

```powershell
npm run build
npm run preview
```

`npm run build` menjalankan pemeriksaan TypeScript (`tsc -b`) lalu membangun aset produksi ke folder `dist/`. `npm run preview` menyajikan hasil build secara lokal. Hasil uji aktual harus dicatat terpisah di [`docs/TESTING.md`](./docs/TESTING.md).

## Variabel lingkungan Firebase

Variabel yang dibaca aplikasi (nama saja; nilai disediakan oleh pengelola Firebase):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Firebase Auth mendukung Email/Password dan Google jika provider diaktifkan di Firebase Console. Firestore Rules yang digunakan berada di `firebase/firestore.rules`. Progres akun disimpan pada `studentProgress/{uid}` dan akun guru memerlukan dokumen `users/{uid}` dengan field `role` bernilai `teacher`. Menu aplikasi saja bukan pengganti pengamanan Rules server.

## Deploy hosting SPA

Navigasi internal memakai state React, bukan URL router. Hosting harus mengarahkan request halaman aplikasi kembali ke `index.html` agar SPA dapat dimuat pada akses langsung. Untuk Vercel, atur rewrite semua path aplikasi ke `/`; untuk Netlify, aturan yang umum adalah `/* /index.html 200`. Pastikan konfigurasi ini dan akses URL produksi benar-benar diuji sebelum rilis.

## Keterbatasan yang masih terbuka

- Data uji, reset, kuis, localStorage quota, akses Rules, dan skenario jaringan perlu dibuktikan di browser/lingkungan yang dicatat; jangan menganggap dokumentasi ini sebagai laporan PASS.
- Menurut audit yang menjadi acuan, AD10-01 sampai AD10-07 berstatus terbuka/belum diperbaiki. Rincian dan catatan perbedaan terhadap kode workspace ada di [`docs/BACKLOG.md`](./docs/BACKLOG.md).
- Kegagalan sinkronisasi menampilkan peringatan, tetapi rekonsiliasi perubahan pending lintas sesi tetap menjadi perhatian audit.
- Katalog menyimpan kondisi sampel berbeda-beda; tidak semua sampel berada pada 0.050 mol/L. Lampu/gelembung hanya indikator kualitatif.
- Video Beranda bergantung pada YouTube dan memiliki tautan langsung ke YouTube; belum ada file video lokal fallback.

Untuk pemetaan komponen, penyimpanan, dan alur, lihat [`docs/DESAIN_TEKNIS.md`](./docs/DESAIN_TEKNIS.md) dan [`docs/USER_FLOW.md`](./docs/USER_FLOW.md).
