# Alur Pengguna KimiaLab

Pemetaan ini mengikuti state dan kontrol di antarmuka. Navigasi halaman berlangsung di dalam aplikasi tanpa perubahan path URL.

## 1. Alur inti belajar

1. **Beranda** — pengguna membaca pertanyaan pemantik tentang air garam dan air gula, dapat menulis/menyimpan dugaan awal, lalu memilih Materi Konsep. Video YouTube dapat dibuka melalui embed atau tautan langsung.
2. **Materi Konsep** — pengguna mempelajari konsep larutan, ion, elektrolit kuat/lemah dan nonelektrolit, lalu menuju lab.
3. **Laboratorium Virtual** — pilih salah satu tab:
   - **Percobaan 1 · Sampel baku:** pilih sampel, nyalakan saklar, amati lampu/gelembung, catat keduanya, pilih kesimpulan, lalu periksa jawaban.
   - **Percobaan 2 · Larutan sehari-hari:** pilih sampel dan prediksi kategori, tekan **Kunci Prediksi**, baru saklar dapat dinyalakan. Catat lampu/gelembung dan periksa jawaban. Prediksi terkunci tidak dapat diubah pada sesi sampel itu.

   Kedua percobaan menampilkan model SVG dengan sumber 6 V DC. Hasil dan skor per sampel tersimpan pada Lembar Kerja. Model gelembung mengikuti pemetaan dataset dan tidak dimaksudkan sebagai prediksi kuantitatif elektrolisis.
4. **Lembar Kerja (LKPD)** — lihat rekap sampel baku dan larutan sehari-hari, buka detail hasil, ulangi uji sampel, tulis/simpan kesimpulan umum, lalu buka Evaluasi.
5. **Evaluasi** — jawab 10 pilihan ganda dan 2 esai; seluruh butir harus diisi sebelum dikirim. PG dinilai otomatis, masing-masing 10 poin. Esai disimpan untuk penilaian manual guru. Setelah pengiriman, skor dan pembahasan PG ditampilkan; pengguna dapat memulai percobaan baru.
6. **Hasil Belajar / Akses Guru** — Hasil Belajar memperlihatkan progres eksperimen, kesimpulan, nilai dan riwayat kuis serta menawarkan reset progres. Guru dengan role yang terkonfigurasi dapat membuka Akses Guru untuk melihat pengumpulan dan mengisi nilai esai/catatan.

## 2. Mode identitas

- **Tamu:** dapat melanjutkan tanpa Firebase. Progres dan draf kuis berada di localStorage browser dengan ruang lingkup identitas tamu; tidak tersinkron lintas perangkat. Keluar tidak mengubah akun lain.
- **Akun:** autentikasi Firebase mendukung email/kata sandi dan Google. Progres memakai cache lokal per UID dan dapat disinkronkan ke Firestore. Ketika layanan belum siap atau data sedang dimuat, layar login/pesan status yang sesuai ditampilkan.
- **Membatalkan popup Google:** bila popup ditutup sebelum selesai, komponen login menampilkan pesan bahwa jendela ditutup; popup diblokir juga memiliki pesan tersendiri. Pengguna tetap dapat mencoba ulang atau lanjut sebagai tamu.
- **Hak guru:** menu hanya ditampilkan untuk role `teacher` yang dibaca dari `users/{uid}`. Aturan Firestore juga menentukan akses. Catatan AD10-01 tetap terbuka menurut audit; lakukan uji otorisasi sebelum menyatakan batas ini aman.

## 3. Keadaan khusus dan pemulihan

| Keadaan | Perilaku berdasarkan implementasi saat ini / tindakan pengguna |
|---|---|
| Sinkronisasi gagal | Peringatan menyatakan bahwa progres masih tersimpan di perangkat tetapi gagal disinkronkan. Hasil kuis memiliki pesan kegagalan dan aksi coba simpan kembali. Catatan audit menyebut belum ada retry umum untuk semua perubahan; jangan menganggap semua operasi bisa direkonsiliasi otomatis. |
| Reset seluruh progres | Tombol di Hasil Belajar meminta konfirmasi. Membatalkan konfirmasi tidak menghapus data. Untuk akun, jika penghapusan riwayat server gagal, reset dibatalkan dan aplikasi memberi peringatan. |
| JSON progres lokal rusak | Pembacaan progres mencatat error di console dan mengembalikan progres default untuk identitas tersebut. Backup/diagnostik data rusak belum disediakan di UI. |
| JSON draf kuis rusak | Pemulihan draf gagal dengan pesan di Evaluasi; jawaban tersimpan sebelumnya dapat ditampilkan sebagai hasil bila tersedia. |
| Refresh saat mengisi kuis | Kode saat ini menyimpan draf ke localStorage pada perubahan jawaban dan memulihkan draf saat evaluasi dibuka kembali. Ini berbeda dari temuan AD10-04; uji ulang dan catat bukti sebelum menutup/menegaskan temuan. |
| Refresh saat eksperimen | Progres tersimpan yang sudah dikirim ke handler, termasuk prediksi terkunci Percobaan 2 dan hasil yang diperiksa, dapat dipulihkan dari catatan LKPD. Keadaan visual sementara (misalnya saklar/animasi yang sedang ON sebelum dicatat) adalah state komponen dan tidak dijamin dipulihkan. |
| Kuota/penolakan localStorage | Jalur tulis dapat gagal. UI draf evaluasi menampilkan peringatan; beberapa aksi progres lain memiliki penanganan berbeda. Temuan AD10-05 memerlukan uji penyimpanan penuh dan bukti per fitur, bukan asumsi bahwa seluruh progres tersimpan. |
| Percobaan ulang kuis | Kode saat ini membuat ID percobaan baru untuk retake setelah hasil terkirim. Temuan AD10-03 masih harus diuji pada progres lokal dan Firestore karena audit melaporkan ID lama menimpa riwayat. |
| YouTube tidak termuat | Beranda menyediakan tautan untuk membuka video di YouTube. Tidak ditemukan video lokal; jalur pembelajaran lokal yang tersedia adalah pertanyaan pemantik dan Materi Konsep. Pesan/fallback otomatis khusus untuk kegagalan embed belum diimplementasikan. |
| Akses tanpa konfigurasi Firebase | Firebase dinonaktifkan bila variabel wajib tidak lengkap; pilihan lanjut sebagai tamu tetap tersedia. Dengan konfigurasi, pengguna dapat menggunakan auth dan sinkronisasi akun. |

## 4. Catatan uji alur

Belum ada hasil pengujian browser yang dicatat oleh dokumen ini. Isi bukti aktual, perangkat/browser, dan status per skenario pada [`../TESTING.md`](../TESTING.md); jangan mengubah status menjadi PASS sebelum langkah benar-benar dijalankan.
