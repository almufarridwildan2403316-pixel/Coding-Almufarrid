# Templat Pengujian KimiaLab

> Salin atau lengkapi rekaman untuk setiap putaran pengujian. Jangan menandai PASS tanpa menjalankan langkah dan mencatat bukti aktual.

## 1. Identitas Pemeriksaan

- **Tanggal/waktu pemeriksaan:** [ISI MANUAL OLEH TIM]
- **Penguji:** [ISI MANUAL OLEH TIM]
- **Branch / commit source:** [ISI MANUAL OLEH TIM]
- **Status perubahan belum commit:** [ISI MANUAL OLEH TIM]
- **Lingkungan:** [ ] dev &nbsp; [ ] build lokal &nbsp; [ ] preview &nbsp; [ ] produksi
- **URL:** [ISI MANUAL OLEH TIM]
- **Perangkat / OS / browser / versi / ukuran layar:** [ISI MANUAL OLEH TIM]
- **Provider yang diuji (mis. tamu, email/kata sandi, Google):** [ISI MANUAL OLEH TIM]
- **Firebase project / Auth provider / Firestore Rules version yang diuji:** [ISI MANUAL OLEH TIM]

## 2. Arti Status

- **BELUM DIUJI** — langkah belum dijalankan atau belum ada bukti yang dapat diperiksa.
- **PASS** — hasil aktual memenuhi hasil harapan dan bukti dicatat.
- **FAIL** — hasil aktual tidak memenuhi hasil harapan; buat/tautkan issue.
- **TERBLOKIR** — uji tidak dapat dijalankan karena dependensi/akses/lingkungan; tuliskan sebab.
- **N/A** — skenario memang tidak berlaku untuk target uji; sertakan alasan.

## 3. Matriks Pengujian Utama

| ID | Skenario/Langkah | Hasil Harapan | Hasil Aktual/Bukti | Status | Issue/Penguji/Uji Ulang |
|---|---|---|---|---|---|
| TC-01 | Buka Beranda dan telusuri semua item navigasi utama. | Beranda, Materi, Lab, LKPD, Evaluasi, Hasil terbuka; Akses Guru hanya tersedia sesuai role. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-02 | Isi dan simpan jawaban pertanyaan pemantik; ubah teks lalu simpan kembali. | Jawaban tersimpan dan status penyimpanan sesuai aksi. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-03 | Periksa embed YouTube dan tautan “Tonton langsung di YouTube”; coba keadaan embed gagal. | Tautan langsung tersedia; keterbatasan/fallback lokal dicatat tanpa mengklaim video lokal tersedia. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-04 | Dari Beranda buka Materi, lalu gunakan aksi mulai lab. | Navigasi ke Materi dan Lab berfungsi. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-05 | Pada Lab, ubah tab Percobaan 1 dan Percobaan 2. | Daftar sampel, prosedur, dan kondisi mengikuti percobaan aktif. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-06 | Percobaan 1: nyalakan saklar, catat observasi dan kesimpulan. | Interaksi sesuai aturan Percobaan 1; validasi mencegah pemeriksaan sebelum simulasi/field lengkap. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-07 | Percobaan 2: coba saklar tanpa prediksi, lalu pilih prediksi dan kunci. | Saklar terkunci sebelum prediksi; setelah prediksi terkunci, saklar dapat dinyalakan dan prediksi tidak dapat diubah. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-08 | Uji sampel kategori elektrolit kuat pada kondisi sampel yang ditampilkan. | Lampu/gelembung dan penjelasan mengikuti dataset; hasil dilabeli simulasi kualitatif. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-09 | Uji sampel kategori elektrolit lemah pada kondisi sampel yang ditampilkan. | Representasi mengikuti dataset dan tidak menyamakan kuat/lemah dengan pekat/encer. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-10 | Uji sampel nonelektrolit pada kondisi sampel yang ditampilkan. | Lampu, gelembung, kategori dan uraian konsisten dengan dataset. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-11 | Ganti sampel setelah mengisi observasi/skor pada sampel sebelumnya. | State sampel baru tidak menampilkan pengamatan/skor sampel sebelumnya. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-12 | Jalankan Reset simulasi setelah prediksi, observasi dan/atau skor tersimpan. | Saklar, input, skor, status dan record sesuai perilaku reset yang diharapkan; bukti disimpan. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-13 | Selesaikan sampel; buka LKPD, detail sampel, lalu uji ulang. | Catatan, rumus, penjelasan dan skor tampil untuk kunci percobaan/sampel yang benar. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-14 | Isi dan simpan kesimpulan umum di LKPD; refresh dan buka kembali. | Kesimpulan tersimpan pada progres dan ditampilkan kembali. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-15 | Kirim evaluasi dengan 10 PG benar dan dua esai terisi. | Skor PG 100/100, pembahasan tampil, esai tersedia untuk penilaian manual. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-16 | Kirim evaluasi dengan 10 PG salah dan dua esai terisi. | Skor PG 0/100, jawaban dan pembahasan tampil; esai tidak menambah skor otomatis. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-17 | Coba submit evaluasi dengan satu atau lebih jawaban kosong. | Pengiriman tidak terjadi sampai seluruh 12 butir dijawab sesuai validasi UI. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-18 | Isi sebagian PG dan esai, refresh halaman, lalu buka Evaluasi. | Draf pulih atau kegagalannya diberitahukan; catat perbandingan terhadap AD10-04. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-19 | Kirim evaluasi, mulai retake, kirim percobaan kedua; buka riwayat lokal dan akun bila tersedia. | Percobaan memiliki identitas berbeda dan riwayat sebelumnya tidak tertimpa. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-20 | Buka Hasil Belajar; uji batal reset dan konfirmasi reset. | Batal mempertahankan data; konfirmasi membersihkan progres sesuai identitas dan laporan hasilnya akurat. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-21 | Gunakan aplikasi sebagai tamu, refresh, lalu coba login Google; tutup/cancel popup. | Progres tamu terpisah; pembatalan popup menampilkan pesan dan pengguna dapat mencoba lagi/lanjut tamu. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-22 | Putuskan jaringan ketika akun menyimpan progres; pulihkan jaringan/login ulang. | Peringatan dan cache lokal tampak; tidak ada overwrite diam-diam; catat apakah retry/reconcile tersedia. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| TC-23 | Uji keyboard (Tab/Shift+Tab/Enter/Space), fokus, dan layout di desktop serta ponsel. | Kontrol utama dapat dioperasikan, fokus terlihat, konten/tabel tetap dapat digunakan tanpa terpotong. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |

## 4. Matriks Uji Ulang Temuan Audit

| Kode Temuan | Skenario Uji Ulang | Hasil Harapan | Hasil Aktual/Bukti | Status | Commit Perbaikan/Penguji |
|---|---|---|---|---|---|
| AD10-01 | Masuk sebagai tamu/siswa dan coba membuka Akses Guru atau menyimpan review; ulangi sebagai guru sah. | Pengguna non-guru tidak dapat mengakses/menulis review; guru berizin dapat melakukan review sesuai rules. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| AD10-02 | Periksa konteks, tabel pembanding, konsentrasi/kondisi dan kunci jawaban Q3. | Kesimpulan kategori dibatasi pada kondisi pembanding setara dan dijelaskan secara ilmiah. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| AD10-03 | Kirim kuis, retake, kirim kembali, cek dua record lokal dan Firestore. | ID/nomor percobaan baru; record lama tetap utuh dan terlihat di riwayat. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| AD10-04 | Isi sebagian PG dan esai, refresh sebelum submit. | Draf dapat dipulihkan atau pesan kehilangan data eksplisit; tidak ada klaim simpan palsu. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| AD10-05 | Paksa operasi localStorage gagal/kuota penuh saat simpan esai dan submit. | UI tidak menyatakan tersimpan tanpa bukti; data/error/retry diterangkan dengan jelas. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| AD10-06 | Jalankan uji lab, isi pilihan/skor, tekan Reset, lalu periksa state dan record LKPD. | Saklar, pengamatan, prediksi, skor aktif dan data sesuai reset yang diharapkan. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |
| AD10-07 | Buat perubahan saat offline, logout/login ulang lintas sesi, coba pulihkan dan retry tanpa edit teks. | Perubahan lokal tidak hilang/tertimpa diam-diam; status pending, konflik dan retry jelas. | [ISI MANUAL OLEH TIM] | BELUM DIUJI | [ISI MANUAL OLEH TIM] |

## 5. Rilis dan Produksi

- **URL produksi:** [ISI MANUAL OLEH TIM]
- **Akses tanpa login hosting (SPA fallback/direct URL):** [ISI MANUAL OLEH TIM]
- **Provider Auth dan konfigurasi domain terotorisasi:** [ISI MANUAL OLEH TIM]
- **Uji cloud/Firestore Rules di produksi:** [ISI MANUAL OLEH TIM]
- **Uji ponsel nyata:** [ISI MANUAL OLEH TIM]
- **Uji keyboard dan teknologi bantu:** [ISI MANUAL OLEH TIM]
- **Build/preview yang diuji dan commit source:** [ISI MANUAL OLEH TIM]
- **Keterbatasan terbuka dan mitigasi rilis:** [ISI MANUAL OLEH TIM]
