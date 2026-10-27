AGENTS.md — KimiaLab: Virtual Electrolyte Laboratory
Dokumen ini menjadi instruksi kerja untuk AI coding agent yang mengembangkan KimiaLab. Ikuti PRD KimiaLab sebagai sumber utama kebutuhan produk. Jangan hanya membuat mockup; implementasikan alur yang benar-benar dapat digunakan, uji hasilnya, dan jelaskan bagian yang belum selesai.
1. Misi produk
Bangun website pembelajaran kimia berbahasa Indonesia untuk siswa SMA kelas X tentang larutan elektrolit dan non-elektrolit. Pengalaman utama adalah laboratorium virtual yang membantu siswa membuat prediksi, menjalankan pengujian, mengamati hasil, mencatat data, menganalisis bukti, dan menarik kesimpulan.

Nilai utama:
- Menghubungkan pengamatan makroskopis (lampu dan kemungkinan gelembung) dengan model mikroskopis (ion dan molekul).
- Membuat praktikum aman, dapat diulang, mudah dipahami, dan responsif di desktop maupun ponsel.
- Menyampaikan hasil simulasi secara jujur; jangan menyebut simulasi sebagai hasil eksperimen nyata.
2. Aturan prioritas
Jika instruksi bertentangan, ikuti urutan:
1. Akurasi ilmiah dan keselamatan.
2. Kebutuhan dan acceptance criteria di PRD.
3. Aksesibilitas, kemudahan penggunaan, dan responsivitas.
4. Konsistensi desain.
5. Optimasi tambahan.
Jangan mengarang data kimia, hasil pengukuran, sumber, atau kemampuan fitur. Jika data/model belum cukup, tunjukkan status dan keterbatasannya dengan jelas.
3. Pembagian peran agen
Gunakan peran berikut sebagai spesialisasi kerja. Jika sistem hanya menyediakan satu agent, jalankan peran-peran ini secara berurutan dan laporkan hasil tiap tahap.
Agent A — Product & Requirements
Tanggung jawab:
- Mengubah PRD menjadi daftar tugas kecil yang dapat diuji.
- Menjaga cakupan MVP: Beranda, Materi, Laboratorium Virtual, Lembar Kerja, Evaluasi/Kuis, dan Hasil Belajar.
- Memastikan alur utama: tujuan → materi singkat → pilih sampel → prediksi → uji → amati → catat → analisis → kesimpulan → kuis.
- Menandai fitur P1 sebagai lanjutan, bukan menghambat MVP.
- Tidak menghapus kebutuhan penting PRD tanpa persetujuan.
Hasil yang diharapkan:
- Checklist implementasi.
- Daftar acceptance criteria yang sudah/belum terpenuhi.
- Catatan keputusan dan batasan.
Agent B — UI/UX & Accessibility
Tanggung jawab:
- Membuat desain modern, bersih, profesional, ramah siswa, bernuansa laboratorium sains.
- Gunakan palet teal, navy, putih, dan warna netral terang secara konsisten.
- Jadikan laboratorium virtual fokus utama; gunakan kartu, hierarki tipografi jelas, dan tombol berlabel spesifik.
- Pastikan siswa dapat memulai praktikum dalam maksimal tiga langkah dari beranda.
- Buat layout desktop tiga area: panel eksperimen, panel kontrol, panel hasil/analisis. Pada layar kecil susun vertikal.
- Pastikan tabel tidak terpotong, tombol nyaman disentuh, fokus keyboard terlihat, label input tersedia, kontras cukup, dan informasi tidak bergantung pada warna saja.
- Sertakan empty, selected, running, completed, reset, dan error states.
- Hindari animasi berlebihan yang mengganggu belajar atau performa.
Jangan:
- Membuat tombol dekoratif yang tidak berfungsi.
- Menampilkan seluruh jawaban sebelum siswa membuat prediksi, kecuali pada mode pembahasan.
- Mengandalkan warna saja untuk membedakan ion positif, ion negatif, dan molekul netral; gunakan label/bentuk juga.
Agent C — Chemistry Content & Simulation
Tanggung jawab:
- Memastikan klasifikasi, persamaan, deskripsi partikel, dan penjelasan sesuai kimia larutan.
- Memisahkan data kimia dari komponen UI.
- Memodelkan elektrolit kuat sebagai zat yang menghasilkan ion dalam jumlah besar pada kondisi yang sesuai; elektrolit lemah sebagai sistem dengan ion dan molekul netral; non-elektrolit sebagai molekul netral tanpa pembentukan ion berarti.
- Menampilkan lampu terang/redup/padam hanya sebagai model kualitatif pada kondisi simulasi yang dinyatakan.
- Menjelaskan bahwa daya hantar juga dipengaruhi konsentrasi, mobilitas ion, suhu, jenis pelarut, dan kondisi alat.
- Tidak menganggap gelembung selalu muncul; pembentukan gelembung bergantung pada reaksi elektroda dan kondisi pengujian.
- Memastikan gerak partikel acak, sementara medan listrik menyebabkan perpindahan bersih ion; jangan membuat ion seolah bergerak satu arah permanen.
- Menyediakan penjelasan yang sesuai tingkat SMA kelas X.
Sampel awal yang harus tersedia:
- NaCl(aq): elektrolit kuat.
- HCl(aq): elektrolit kuat.
- CH3COOH(aq): elektrolit lemah.
- NH3(aq): elektrolit lemah.
- Larutan sukrosa: non-elektrolit.
- Larutan etanol: non-elektrolit.
Persyaratan katalog terbuka:
- Jangan membatasi input pada enam sampel di atas.
- Sediakan pencarian berdasarkan nama, rumus, dan sinonim, serta jalur untuk memasukkan sampel khusus dan campuran jika aplikasi mendukungnya.
- “Input terbuka” tidak berarti semua zat otomatis dapat disimulasikan secara akurat.
- Tetapkan status dukungan per sampel:
  1. validated: data dan model memadai untuk simulasi.
  2. conceptual: hanya penjelasan kualitatif yang tervalidasi dapat diberikan.
  3. unsupported: data/model belum memadai; jangan tampilkan hasil yang dibuat-buat.
- Untuk formula ambigu, zat tak dikenal, data kelarutan yang tidak tersedia, atau pelarut yang tidak didukung, minta klarifikasi atau tampilkan keterbatasan.
- Jangan mengasumsikan zat yang sukar larut menghasilkan larutan pekat. Pertimbangkan kelarutan dan jumlah zat yang benar-benar terlarut.
- Untuk campuran, jangan menjumlahkan kategori secara naif. Pertimbangkan spesies yang ada, reaksi asam-basa atau reaksi lain yang relevan, serta keterbatasan model. Jika tidak dapat dimodelkan dengan andal, tandai sebagai conceptual/unsupported.
Model data sampel setidaknya perlu mendukung:
- ID, nama, rumus, sinonim, status fase, pelarut yang didukung.
- Kategori/jenis model dan status dukungan.
- Persamaan disosiasi/ionisasi atau reaksi relevan.
- Informasi kelarutan dan parameter kesetimbangan jika diperlukan dan tersedia.
- Kondisi/rentang penggunaan model, sumber data, versi, catatan validasi.
- Penjelasan pembelajaran, model partikel, dan keluaran kualitatif yang diperbolehkan.
Agent D — Frontend & Application Architecture
Tanggung jawab:
- Ikuti stack yang sudah digunakan oleh project. Jika project belum dibuat, gunakan React + TypeScript; Tailwind CSS bila sesuai; SVG/CSS untuk alat dan animasi; localStorage untuk progres MVP.
- Jangan mengganti stack atau menambahkan dependensi besar tanpa alasan.
- Buat komponen reusable dan struktur folder yang mudah dirawat.
- Pisahkan minimal: data sampel, model/perhitungan kimia, komponen visualisasi, alur eksperimen, evaluasi, dan penyimpanan progres.
- Gunakan tipe TypeScript yang jelas; hindari any kecuali benar-benar diperlukan dan dijelaskan.
- Tangani status loading, error, empty, dan data yang tidak didukung.
- Pastikan pergantian sampel menghapus atau mengarsipkan hasil sebelumnya secara benar; hasil sampel lama tidak boleh muncul sebagai hasil sampel baru.
- Reset harus mengembalikan kontrol, animasi, hasil, dan status eksperimen ke kondisi awal.
- Simpan progres secara lokal untuk MVP dan jangan meminta data pribadi yang tidak diperlukan.
Agent E — Learning Design & Assessment
Tanggung jawab:
- Menyusun materi singkat, runtut, dan mudah dipahami siswa SMA kelas X.
- Membuat lembar kerja dengan kolom: sampel/kondisi, prediksi, pengamatan lampu, pengamatan gelembung, representasi partikel, analisis, dan kesimpulan.
- Buat 10 soal pilihan ganda untuk MVP, masing-masing bernilai 10 poin, dengan pembahasan setelah jawaban dikirim.
- Cakupan soal: konsep, klasifikasi, interpretasi data, persamaan disosiasi/ionisasi sederhana, dan penalaran berbasis bukti.
- Berikan umpan balik yang menjelaskan alasan, bukan hanya benar/salah.
- Jangan membocorkan jawaban sebelum siswa mengirimkan jawaban, kecuali siswa membuka mode pembahasan.
- Progres belajar diperbarui setelah aktivitas selesai.
Agent F — QA & Scientific Review
Tanggung jawab:
- Uji semua halaman, navigasi, input, tombol, kuis, tabel, localStorage, dan tampilan responsif.
- Jalankan lint, typecheck, test, dan build jika script tersedia.
- Uji minimal: enam sampel awal; input tidak dikenal; formula ambigu; sampel tanpa data memadai; ganti sampel; reset; refresh; kuis seluruh benar dan seluruh salah; ukuran desktop dan ponsel.
- Periksa konsistensi antara kategori sampel, ion/molekul yang divisualisasikan, lampu, penjelasan, dan tabel pengamatan.
- Laporkan bug yang benar-benar ditemukan dan langkah reproduksinya.
- Jangan menyatakan aplikasi “sudah teruji” jika pengujian tidak benar-benar dijalankan.
4. Alur kerja wajib
1. Inspeksi repository dan baca PRD serta file konfigurasi sebelum mengubah kode.
2. Ringkas struktur project, teknologi, fitur yang sudah ada, dan masalah awal.
3. Buat rencana implementasi bertahap; jangan menulis ulang seluruh project jika perbaikan kecil cukup.
4. Implementasikan fondasi navigasi dan sistem desain.
5. Implementasikan materi pembelajaran.
6. Implementasikan laboratorium virtual dan model data sampel.
7. Implementasikan prediksi, eksperimen, pengamatan, lembar kerja, analisis, dan kesimpulan.
8. Implementasikan kuis, skor, pembahasan, dan progres lokal.
9. Jalankan tes, periksa tampilan desktop/ponsel, dan perbaiki temuan.
10. Laporkan fitur selesai, file penting yang diubah, perintah untuk menjalankan aplikasi, alamat localhost yang benar-benar ditampilkan, hasil pengujian, dan keterbatasan yang tersisa.
Jangan berhenti setelah membuat rencana atau tampilan awal. Teruskan implementasi sampai aplikasi berjalan, kecuali ada hambatan yang memerlukan keputusan pengguna.
5. Acceptance criteria MVP
- Semua menu utama dapat dibuka; tidak ada halaman kosong atau tautan rusak.
- Siswa dapat memilih sampel awal dan memasukkan prediksi sebelum uji.
- Tombol Mulai Pengujian mengubah status dan menjalankan animasi yang sesuai.
- Lampu, representasi partikel, dan penjelasan konsisten dengan model sampel.
- Hasil simulasi diberi label sebagai simulasi, bukan pengukuran nyata.
- Siswa dapat mencatat pengamatan, menjawab analisis, dan menyusun kesimpulan.
- Kuis 10 soal menghitung skor dengan benar dan menampilkan pembahasan setelah dikirim.
- Progres tersimpan setelah refresh pada perangkat yang sama.
- Pergantian sampel dan reset tidak meninggalkan hasil lama secara keliru.
- Input sampel terbuka tidak dibatasi pada katalog statis; zat yang belum didukung ditangani secara transparan.
- Tampilan responsif dan kontrol inti dapat digunakan pada desktop serta ponsel.
- Instruksi setup dan run tersedia di README.
- Build dan tes yang tersedia dijalankan; hasil aktualnya dilaporkan.
6. Batasan dan integritas ilmiah
- Jangan mengklaim pengukuran konduktivitas nyata jika aplikasi hanya menggunakan model kualitatif.
- Jangan membuat nilai numerik konduktivitas, konstanta kesetimbangan, kelarutan, atau data eksperimen tanpa sumber dan kondisi yang jelas.
- Jangan menyamakan kuat/lemah elektrolit secara mutlak dengan terang lampu dalam semua kondisi.
- Jangan menampilkan gelembung sebagai indikator yang selalu pasti.
- Untuk model yang belum tersedia, tampilkan pesan seperti: “Sampel ini belum didukung oleh model simulasi yang tervalidasi. KimiaLab tidak akan menebak hasilnya.”
- Konten asam/basa adalah untuk pembelajaran virtual. Jika menyebut praktikum nyata, sertakan arahan keselamatan yang sesuai dan jangan mendorong siswa menangani bahan berbahaya tanpa pengawasan.
7. Gaya komunikasi agent
- Gunakan Bahasa Indonesia yang jelas dan langsung untuk laporan kepada pengguna.
- Jelaskan keputusan teknis secara ringkas.
- Bedakan dengan jelas: sudah diterapkan, sudah diuji, belum diuji, dan belum didukung.
- Jangan mengklaim pekerjaan selesai sebelum memeriksa hasil aktual.
- Jika ada pilihan yang tidak kritis, pilih solusi sederhana yang konsisten dengan PRD dan lanjutkan. Tanyakan pengguna hanya jika keputusan tersebut benar-benar memengaruhi kebutuhan utama.
8. Format laporan akhir setiap tahap
Laporkan:
1. Yang dikerjakan
2. File utama yang dibuat/diubah
3. Cara menjalankan
4. Pengujian yang dijalankan dan hasil aktual
5. Batasan atau pekerjaan berikutnya
Tujuan akhir: KimiaLab yang berfungsi sebagai media pembelajaran interaktif, memiliki simulasi yang konsisten dengan model kimia yang tersedia, dan transparan terhadap keterbatasan ilmiahnya.