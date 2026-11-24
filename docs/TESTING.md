# Templat Pengujian KimiaLab

> Salin atau lengkapi rekaman untuk setiap putaran pengujian. Jangan menandai PASS tanpa menjalankan langkah dan mencatat bukti aktual.

## 1. Identitas Pemeriksaan

- **Tanggal/waktu pemeriksaan:** 2026-11-24
- **Penguji:** Copilot SDK (pengujian browser lokal dibantu otomatisasi Playwright)
- **Branch / commit source:** Working tree saat pengujian; commit source belum ditentukan dan tidak ada commit/push otomatis
- **Status perubahan belum commit:** Ada perubahan kerja pada sumber aplikasi dan dokumentasi pengujian
- **Lingkungan:** [x] dev &nbsp; [x] build lokal &nbsp; [ ] preview &nbsp; [ ] produksi
- **URL:** http://127.0.0.1:5173
- **Perangkat / OS / browser / versi / ukuran layar:** Desktop Windows, Chromium 150, viewport desktop browser
- **Provider yang diuji (mis. tamu, email/kata sandi, Google):** Mode tamu lokal
- **Firebase project / Auth provider / Firestore Rules version yang diuji:** Tidak dapat diverifikasi tanpa akun/project nyata; koneksi cloud belum diuji

## 2. Arti Status

- **BELUM DIUJI** — langkah belum dijalankan atau belum ada bukti yang dapat diperiksa.
- **PASS** — hasil aktual memenuhi hasil harapan dan bukti dicatat.
- **FAIL** — hasil aktual tidak memenuhi hasil harapan; buat/tautkan issue.
- **TERBLOKIR** — uji tidak dapat dijalankan karena dependensi/akses/lingkungan; tuliskan sebab.
- **N/A** — skenario memang tidak berlaku untuk target uji; sertakan alasan.

## 3. Matriks Pengujian Utama

| ID | Skenario/Langkah | Hasil Harapan | Hasil Aktual/Bukti | Status | Issue/Penguji/Uji Ulang |
|---|---|---|---|---|---|
| TC-01 | Buka Beranda dan telusuri semua item navigasi utama. | Beranda, Materi, Lab, LKPD, Evaluasi, Hasil terbuka; Akses Guru hanya tersedia sesuai role. | Sebagai tamu, menu menampilkan Beranda, Materi, Lab, LKPD, Evaluasi, dan Hasil; item “Akses Guru” tidak tampil. Halaman masing-masing dapat dibuka dari navigasi. | PASS | Browser lokal Playwright; uji akun guru nyata belum dilakukan |
| TC-02 | Isi dan simpan jawaban pertanyaan pemantik; ubah teks lalu simpan kembali. | Jawaban tersimpan dan status penyimpanan sesuai aksi. | Teks awal disimpan, status berubah menjadi “Ada perubahan yang belum disimpan.” saat diedit, lalu tombol aktif; setelah simpan ulang, status menampilkan tanggal penyimpanan dan tombol kembali disabled. | PASS | Browser tamu Playwright |
| TC-03 | Periksa embed YouTube dan tautan “Tonton langsung di YouTube”; coba keadaan embed gagal. | Tautan langsung tersedia; keterbatasan/fallback lokal dicatat tanpa mengklaim video lokal tersedia. | Beranda menampilkan iframe/placeholder YouTube dan tautan langsung ke YouTube. Saat embed gagal/permintaan eksternal dibatalkan, teks fallback tetap memberi tahu bahwa ini video pengantar dan tidak mengklaim video tersedia lokal. | PASS terbatas | Browser lokal; pemutaran tergantung jaringan YouTube |
| TC-04 | Dari Beranda buka Materi, lalu gunakan aksi mulai lab. | Navigasi ke Materi dan Lab berfungsi. | Dari menu dan tombol “Buka Laboratorium Virtual” pada Materi, halaman Lab terbuka dengan daftar sampel dan prosedur Percobaan 1. | PASS | Browser tamu Playwright |
| TC-05 | Pada Lab, ubah tab Percobaan 1 dan Percobaan 2. | Daftar sampel, prosedur, dan kondisi mengikuti percobaan aktif. | Tab Percobaan 1 menampilkan “Sampel larutan baku”; tab Percobaan 2 menampilkan daftar “Larutan sehari-hari”, prosedur prediksi, dan saklar terkunci sebelum prediksi. | PASS | Browser tamu Playwright |
| TC-06 | Percobaan 1: nyalakan saklar, catat observasi dan kesimpulan. | Interaksi sesuai aturan Percobaan 1; validasi mencegah pemeriksaan sebelum simulasi/field lengkap. | Natrium klorida menghasilkan lampu terang saat saklar ON; observasi dan kesimpulan dapat dipilih; jawaban lengkap menghasilkan “3/3” dan tersimpan ke LKPD. Kontrol observasi terkunci sebelum saklar ON. | PASS | Browser tamu Playwright |
| TC-07 | Percobaan 2: coba saklar tanpa prediksi, lalu pilih prediksi dan kunci. | Saklar terkunci sebelum prediksi; setelah prediksi terkunci, saklar dapat dinyalakan dan prediksi tidak dapat diubah. | Sebelum prediksi, saklar dan kontrol observasi disabled. Setelah memilih Elektrolit kuat dan menekan Kunci Prediksi, prediksi menjadi disabled dan saklar aktif. | PASS | Browser tamu Playwright |
| TC-08 | Uji sampel kategori elektrolit kuat pada kondisi sampel yang ditampilkan. | Lampu/gelembung dan penjelasan mengikuti dataset; hasil dilabeli simulasi kualitatif. | Natrium klorida/Air garam menunjukkan lampu terang dan banyak gelembung; skor penuh dan penjelasan persamaan ionisasi tampil. | PASS | Browser tamu Playwright |
| TC-09 | Uji sampel kategori elektrolit lemah pada kondisi sampel yang ditampilkan. | Representasi mengikuti dataset dan tidak menyamakan kuat/lemah dengan pekat/encer. | Asam asetat 0.010 mol/L pada 25 °C menampilkan lampu redup saat saklar ON dan antarmuka mempertahankan penjelasan bahwa kuat/lemah tidak sama dengan pekat/encer. | PASS | Browser tamu Playwright |
| TC-10 | Uji sampel nonelektrolit pada kondisi sampel yang ditampilkan. | Lampu, gelembung, kategori dan uraian konsisten dengan dataset. | Glukosa menampilkan lampu mati saat saklar ON dan kategori nonelektrolit tetap sesuai dataset simulasi. | PASS | Browser tamu Playwright |
| TC-11 | Ganti sampel setelah mengisi observasi/skor pada sampel sebelumnya. | State sampel baru tidak menampilkan pengamatan/skor sampel sebelumnya. | Setelah sampel diganti dari Glukosa ke Natrium klorida, lampu kembali ke keadaan tunggu saklar, seluruh dropdown observasi kembali kosong/disabled, dan skor aktif tidak bertahan. | PASS | Browser tamu Playwright |
| TC-12 | Jalankan Reset simulasi setelah prediksi, observasi dan/atau skor tersimpan. | Saklar, input, skor, status dan record sesuai perilaku reset yang diharapkan; bukti disimpan. | Browser lokal: memilih Terang/Banyak/Elektrolit kuat menghasilkan 3/3, lalu Reset mematikan saklar dan mengosongkan ketiga dropdown serta skor aktif; perbaikan menghapus penulisan record kosong agar riwayat LKPD tetap utuh. | PASS | Pengujian Playwright lokal; belum diuji reload permanen setelah build lama |
| TC-13 | Selesaikan sampel; buka LKPD, detail sampel, lalu uji ulang. | Catatan, rumus, penjelasan dan skor tampil untuk kunci percobaan/sampel yang benar. | LKPD menampilkan Air garam sebagai Elektrolit kuat dengan lampu Terang, gelembung Banyak, dan skor 3/3; tombol detail/uji ulang tersedia. | PASS | Browser tamu Playwright |
| TC-14 | Isi dan simpan kesimpulan umum di LKPD; refresh dan buka kembali. | Kesimpulan tersimpan pada progres dan ditampilkan kembali. | Kesimpulan disimpan, status hasil tampil, refresh dipulihkan sebagai sesi tamu, dan teks kesimpulan tetap tampil setelah membuka LKPD kembali. | PASS | Browser tamu Playwright + refresh |
| TC-15 | Kirim evaluasi dengan 10 PG benar dan dua esai terisi. | Skor PG 100/100, pembahasan tampil, esai tersedia untuk penilaian manual. | Setelah semua 12 butir terisi, pengiriman menghasilkan hasil 100/100, pembahasan benar tampil untuk seluruh PG, dan kedua esai ditampilkan dengan status menunggu tinjauan guru. | PASS | Browser tamu Playwright |
| TC-16 | Kirim evaluasi dengan 10 PG salah dan dua esai terisi. | Skor PG 0/100, jawaban dan pembahasan tampil; esai tidak menambah skor otomatis. | Percobaan kedua dengan pilihan PG salah menghasilkan 0/100, pembahasan benar tampil untuk seluruh soal, dan kedua esai tetap tersimpan tanpa menambah skor otomatis. | PASS | Browser tamu Playwright |
| TC-17 | Coba submit evaluasi dengan satu atau lebih jawaban kosong. | Pengiriman tidak terjadi sampai seluruh 12 butir dijawab sesuai validasi UI. | Pada percobaan baru, tombol menampilkan “Kirim Jawaban (0/12 Terjawab)” dan disabled; submit tidak dapat dijalankan sampai 12 butir terisi. | PASS | Browser tamu Playwright |
| TC-18 | Isi sebagian PG dan esai, refresh halaman, lalu buka Evaluasi. | Draf pulih atau kegagalannya diberitahukan; catat perbandingan terhadap AD10-04. | Browser tamu: memilih jawaban Soal 3 dan mengisi esai Soal 11, refresh, masuk kembali ke Evaluasi; status “Draf jawaban dipulihkan dari perangkat ini” muncul dan teks pilihan/esai tetap terisi. | PASS | Pengujian Playwright lokal |
| TC-19 | Kirim evaluasi, mulai retake, kirim percobaan kedua; buka riwayat lokal dan akun bila tersedia. | Percobaan memiliki identitas berbeda dan riwayat sebelumnya tidak tertimpa. | Percobaan 100/100 dikirim, retake membuat percobaan baru, percobaan kedua menghasilkan 0/100, dan Hasil Belajar menampilkan dua baris: Percobaan #1 100 dan Percobaan #2 0. Rekaman draf retake juga memiliki `attemptId` UUID baru. | PASS terbatas | Browser tamu lokal; sinkronisasi Firestore dua akun belum tersedia |
| TC-20 | Buka Hasil Belajar; uji batal reset dan konfirmasi reset. | Batal mempertahankan data; konfirmasi membersihkan progres sesuai identitas dan laporan hasilnya akurat. | Pembatalan konfirmasi mempertahankan hasil; konfirmasi kedua membersihkan progres menjadi 0/40, 40 sampel belum dikerjakan, evaluasi belum dikerjakan, riwayat percobaan kosong, dan Lab kembali belum selesai. | PASS | Browser tamu Playwright + dialog konfirmasi |
| TC-21 | Gunakan aplikasi sebagai tamu, refresh, lalu coba login Google; tutup/cancel popup. | Progres tamu terpisah; pembatalan popup menampilkan pesan dan pengguna dapat mencoba lagi/lanjut tamu. | Mode tamu dipulihkan setelah refresh dan progres pemantik/kesimpulan tetap terpisah; login Google serta cancel popup belum dapat diuji tanpa Auth provider nyata. | PASS terbatas | Pengujian tamu + refresh lokal; Firebase Auth nyata dibutuhkan |
| TC-22 | Putuskan jaringan ketika akun menyimpan progres; pulihkan jaringan/login ulang. | Peringatan dan cache lokal tampak; tidak ada overwrite diam-diam; catat apakah retry/reconcile tersedia. | Implementasi antrean pending/retry dan listener online tersedia; pengujian offline lintas sesi butuh akun Firebase nyata serta perangkat/network yang dapat dikontrol. | TERBLOKIR | Tidak ada konfigurasi Firebase aktif/akun uji |
| TC-23 | Uji keyboard (Tab/Shift+Tab/Enter/Space), fokus, dan layout di desktop serta ponsel. | Kontrol utama dapat dioperasikan, fokus terlihat, konten/tabel tetap dapat digunakan tanpa terpotong. | Tab pertama memindahkan fokus ke kontrol yang terlihat; menu mobile berfungsi pada viewport 390×844 dan dapat dibuka dengan tombol, lalu layout desktop dikembalikan pada 1280×800. | PASS terbatas | Browser Playwright desktop/mobile viewport; uji pembaca layar tidak dilakukan |

## 4. Matriks Uji Ulang Temuan Audit

| Kode Temuan | Skenario Uji Ulang | Hasil Harapan | Hasil Aktual/Bukti | Status | Commit Perbaikan/Penguji |
|---|---|---|---|---|---|
| AD10-01 | Masuk sebagai tamu/siswa dan coba membuka Akses Guru atau menyimpan review; ulangi sebagai guru sah. | Pengguna non-guru tidak dapat mengakses/menulis review; guru berizin dapat melakukan review sesuai rules. | Menu tamu berhasil dibuka dan tidak menampilkan “Akses Guru”. State App, helper penyimpanan, dan Firestore Rules membatasi dashboard/review pada UID dengan role guru sah. Pengujian menulis review oleh akun guru nyata belum tersedia. | PASS terbatas | Browser tamu lokal; uji Auth/Rules cloud belum tersedia |
| AD10-02 | Periksa konteks, tabel pembanding, konsentrasi/kondisi dan kunci jawaban Q3. | Kesimpulan kategori dibatasi pada kondisi pembanding setara dan dijelaskan secara ilmiah. | Browser menampilkan Soal 3 dengan konsentrasi, volume, suhu, tegangan, elektroda, dan jarak yang setara. Jawaban Q3 tetap ilmiah untuk perbandingan setara. | PASS | Pengujian browser lokal |
| AD10-03 | Kirim kuis, retake, kirim kembali, cek dua record lokal dan Firestore. | ID/nomor percobaan baru; record lama tetap utuh dan terlihat di riwayat. | Hasil 100/100 dan 0/100 tetap terdaftar sebagai Percobaan #1 dan #2; draf retake menyimpan UUID attempt baru. Sinkronisasi kedua record ke Firestore belum dapat diverifikasi tanpa akun nyata. | PASS terbatas | Browser tamu lokal; uji Firestore belum tersedia |
| AD10-04 | Isi sebagian PG dan esai, refresh sebelum submit. | Draf dapat dipulihkan atau pesan kehilangan data eksplisit; tidak ada klaim simpan palsu. | Browser berhasil memilih Soal 3, mengisi esai, refresh, lalu pemulihan status dan isi jawaban berhasil. | PASS | Pengujian Playwright lokal |
| AD10-05 | Paksa operasi localStorage gagal/kuota penuh saat simpan esai dan submit. | UI tidak menyatakan tersimpan tanpa bukti; data/error/retry diterangkan dengan jelas. | Dengan `Storage.prototype.setItem` dipaksa throw, UI menampilkan `Gagal menyimpan jawaban: Quota exceeded` dan menahan teks yang diketik di layar. Tidak ada klaim “tersimpan”. | PASS | Simulasi kegagalan browser lokal |
| AD10-06 | Jalankan uji lab, isi pilihan/skor, tekan Reset, lalu periksa state dan record LKPD. | Saklar, pengamatan, prediksi, skor aktif dan data sesuai reset yang diharapkan. | Browser mencapai 3/3, Reset mematikan saklar, mengosongkan dropdown lampu/gelembung/kesimpulan, dan menonaktifkan kontrol. Perbaikan memastikan Reset tidak menulis record kosong. | PASS | Pengujian Playwright lokal |
| AD10-07 | Buat perubahan saat offline, logout/login ulang lintas sesi, coba pulihkan dan retry tanpa edit teks. | Perubahan lokal tidak hilang/tertimpa diam-diam; status pending, konflik dan retry jelas. | Kode memiliki antrean per UID, rekonsiliasi pending, Retry, dan listener `online`. Belum dapat diuji lintas logout/login nyata tanpa Auth/Firestore cloud. | TERBLOKIR | Verifikasi kode; perlu akun dan network nyata |

## 5. Rilis dan Produksi

- **URL produksi:** [ISI MANUAL OLEH TIM]
- **Akses tanpa login hosting (SPA fallback/direct URL):** [ISI MANUAL OLEH TIM]
- **Provider Auth dan konfigurasi domain terotorisasi:** [ISI MANUAL OLEH TIM]
- **Uji cloud/Firestore Rules di produksi:** [ISI MANUAL OLEH TIM]
- **Uji ponsel nyata:** [ISI MANUAL OLEH TIM]
- **Uji keyboard dan teknologi bantu:** [ISI MANUAL OLEH TIM]
- **Build/preview yang diuji dan commit source:** [ISI MANUAL OLEH TIM]
- **Keterbatasan terbuka dan mitigasi rilis:** [ISI MANUAL OLEH TIM]
