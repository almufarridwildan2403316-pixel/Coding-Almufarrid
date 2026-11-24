# Backlog dan Catatan Audit KimiaLab

Catatan audit yang menjadi acuan adalah untuk commit `8a2111f`; daftar AD10 di bawah dicatat sesuai temuan audit yang diberikan. Status implementasi merujuk pada pembacaan kode di workspace. **Status pengujian belum dicatat** kecuali ada bukti di [`TESTING.md`](./TESTING.md). Perbedaan terhadap kode sekarang diberi catatan dan menunggu uji ulang.

## 1. Prioritas MVP

| ID | Cakupan | Alasan belajar | Kriteria penerimaan ringkas | Status workspace |
|---|---|---|---|---|
| MVP-01 | Materi konsep, Lab Virtual (2 percobaan), LKPD, Evaluasi 10 PG + 2 esai | Menghubungkan konsep larutan/ion dengan prediksi, bukti pengamatan, kesimpulan, dan asesmen. | Alur Beranda → Materi → lab → LKPD → evaluasi dapat diselesaikan; percobaan 2 mengunci prediksi sebelum uji; catatan dan pembahasan tersedia setelah aktivitas; hasil simulasi dilabeli model. | Komponen dan alur tersedia di kode; uji penerimaan belum dicatat. |
| MVP-02 | Penyimpanan lokal serta integrasi Firebase Auth/Firestore dan Akses Guru | Memberi pilihan belajar tamu, pemulihan progres per akun, serta review esai oleh guru. | Tamu tersimpan per browser; akun menggunakan UID dan dokumen `studentProgress`; rules membatasi progres ke pemilik, akses guru berbasis role; kegagalan dilaporkan dan alur reset diuji. | Implementasi tersedia; konfigurasi cloud/Rules dan uji akses lingkungan nyata belum dibuktikan dalam dokumen ini. |
| MVP-03 | Simulasi interaktif uji daya hantar listrik | Memberi representasi kualitatif hubungan ion bergerak, lampu, dan kemungkinan gas di elektroda. | Sampel/kondisi ditampilkan; saklar menjalankan visual; prediksi awal dikunci di Percobaan 2; kontrol observasi, feedback, reset, dan label simulasi konsisten. | SVG dan interaksi dua percobaan tersedia; belum merupakan pengukuran konduktivitas nyata; uji belum dicatat. |

## 2. Rincian fitur interaktif terpilih

### Lab Virtual Uji Daya Hantar Listrik Larutan

- **Tujuan belajar:** menghubungkan perilaku ion/molekul dalam larutan dengan pengamatan kualitatif; membedakan elektrolit kuat, lemah, dan nonelektrolit; berlatih membuat prediksi dan menyimpulkan berdasarkan bukti.
- **Variabel/keluaran yang diamati:** kategori dan kondisi sampel, intensitas lampu (terang/redup/mati), serta gelembung gas (banyak/sedikit/tidak ada). Pada antarmuka siswa terutama memilih sampel dan mencatat hasil; tidak ada kontrol konsentrasi atau tegangan yang dapat diubah.
- **Batas model yang diminta untuk acuan:** 0.050 mol/L, 25 °C, sumber visual 6 V DC. Parameter alat yang ditampilkan juga mencakup 10 detik, volume 100 mL, elektroda inert virtual, dan jarak 2 cm. Semuanya asumsi simulasi digital, bukan instruksi praktikum fisik.
- **Catatan kesesuaian data:** `src/data/larutan.md` memberi kondisi per sampel; terdapat sampel 0.010 mol/L, 0.005 mol/L, dan kondisi model lain, tidak semuanya 0.050 mol/L. Karena itu nilai 0.050 mol/L adalah acuan/benchmark terbatas, bukan klaim bahwa seluruh katalog menggunakan konsentrasi tersebut. Kuat/lemah tidak sama dengan pekat/encer.
- **Model visual:** gejala lampu dan gelembung dipetakan secara pedagogis dari kategori; gelembung adalah representasi kualitatif proses di elektroda, bukan akibat otomatis ionisasi. Aplikasi tidak menghitung konduktivitas numerik atau produk elektrolisis spesifik tiap sampel.
- **Video pengantar Beranda:** embed YouTube memiliki tautan langsung “Tonton langsung di YouTube”. Jika embed gagal, alternatif yang dapat dipakai secara lokal adalah membaca pertanyaan pemantik dan membuka Materi Konsep. Aplikasi saat ini tidak memuat video lokal atau indikator kegagalan embed khusus; fallback video lokal/teks intervensi masih merupakan kebutuhan produk, bukan fitur yang boleh diklaim sudah tersedia.

## 3. Temuan uji dan tindak lanjut audit

Semua status berikut dicatat sebagai **TERBUKA / BELUM DIPERBAIKI** berdasarkan daftar audit yang diberikan. Catatan inspeksi kode adalah petunjuk verifikasi, bukan alasan untuk menutup temuan tanpa uji ulang. Kode yang tampak terkait sudah berubah/menyediakan perilaku tertentu pada workspace ini untuk sebagian temuan; buktikan pada versi dan lingkungan yang diuji.

| Kode | Prioritas | Temuan audit | Berkas terkait | Tindak lanjut / kriteria penutupan | Status |
|---|---:|---|---|---|---|
| AD10-01 | P1 | Akses Guru terbuka untuk sesi siswa/tamu dan dapat mengubah nilai/catatan esai sendiri. | `Navbar.tsx`, `App.tsx`, `storage.ts`, `firestore.rules` | Uji tamu/siswa mencoba membuka halaman dan menyimpan review; uji akun guru berizin; verifikasi rules menolak tulis pengguna non-guru. UI saat ini menyaring menu guru dan rules mensyaratkan `isTeacher()`, sehingga temuan audit perlu direproduksi ulang sebelum disimpulkan masih terjadi. | TERBUKA / BELUM DIPERBAIKI |
| AD10-02 | P1 | Q3 mengunci jawaban elektrolit lemah dari lampu redup/gelembung sedikit tanpa syarat konsentrasi/kondisi pembanding. | `Evaluasi.tsx` | Pastikan soal dan kunci secara eksplisit menautkan pengamatan pada kondisi setara dan tidak menggeneralisasi intensitas lampu sebagai satu-satunya ukuran. Kode saat ini mencantumkan konsentrasi/volume, alat, tegangan, elektroda, dan jarak tetap di konteks Q3; audit perlu dicek ulang. | TERBUKA / BELUM DIPERBAIKI |
| AD10-03 | P2 | Retake setelah hasil tersimpan masih memakai ID lama sehingga menimpa riwayat sebelumnya. | `Evaluasi.tsx`, `storage.ts` | Kirim percobaan pertama, retake, kirim lagi; pastikan ID dan dua item riwayat berbeda lokal/cloud. Kode saat ini membuat ID baru di `handleRetake`, tetapi skenario persistensi lintas sesi tetap harus diuji. | TERBUKA / BELUM DIPERBAIKI |
| AD10-04 | P1 | Draf pilihan PG dan esai yang belum dikirim hilang setelah halaman di-refresh. | `Evaluasi.tsx` | Isi sebagian PG/esai, refresh dan pulihkan draf untuk tamu serta akun. Kode saat ini memanggil `saveQuizDraft` pada perubahan dan `getQuizDraft` saat inisialisasi; catat hasil uji pada HEAD. | TERBUKA / BELUM DIPERBAIKI |
| AD10-05 | P1 | Kegagalan simpan localStorage tetap menampilkan klaim esai tersimpan tanpa peringatan. | `storage.ts`, `Evaluasi.tsx` | Simulasikan localStorage melempar error/kuota penuh saat mengedit dan submit; pastikan klaim sukses tidak tampil tanpa bukti simpan, jawaban tetap ditangani transparan. Kode saat ini menampilkan pesan gagal draf dan mengelola retry, tetapi kegagalan di jalur submit perlu dibuktikan. | TERBUKA / BELUM DIPERBAIKI |
| AD10-06 | P2 | Reset simulasi hanya mematikan saklar, sementara pilihan pengamatan dan skor aktif bertahan. | `LabVirtual.tsx` | Isi prediksi, observasi, skor, lalu reset; pastikan kontrol kembali kosong, skor hilang dan catatan tersimpan untuk sampel ikut direset. Handler reset saat ini tampak mengosongkan state dan menyimpan record belum selesai; retest tetap diperlukan. | TERBUKA / BELUM DIPERBAIKI |
| AD10-07 | P1 | Perubahan lokal yang gagal disinkronkan tertimpa versi server lama saat logout/login ulang; tidak ada tombol retry tanpa mengubah teks. | `App.tsx`, `storage.ts` | Putuskan jaringan, ubah data, logout/login ulang, lalu pulihkan/sinkronkan tanpa mengedit konten; pastikan konflik dan status antrean jelas serta tidak ada overwrite diam-diam. Audit melaporkan antrean pending belum direkonsiliasi lintas sesi. | TERBUKA / BELUM DIPERBAIKI |

### Kebijakan status audit

Status di atas tidak sama dengan hasil uji browser saat ini. Sebelum menandai selesai, catat langkah reproduksi, lingkungan, bukti, dan commit perbaikan di [`TESTING.md`](./TESTING.md), lalu perbarui status backlog berdasarkan bukti tersebut.

## 4. Riwayat keputusan scope

Pada PRD awal, login siswa, database online, dan dashboard guru ditempatkan sebagai fitur lanjutan/tidak termasuk MVP. Implementasi workspace kemudian menambahkan login Google, Firebase Authentication, sinkronisasi Cloud Firestore, role guru berbasis dokumen `users/{uid}`, dan dashboard review esai. Fitur tersebut berada di luar cakupan MVP awal; pertahankan sebagai keputusan scope yang eksplisit dan tetap uji aturan akses serta pemulihan progres.
