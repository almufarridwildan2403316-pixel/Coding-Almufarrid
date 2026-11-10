# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Konfigurasi autentikasi Supabase

Fitur login, pendaftaran, pemulihan kata sandi, Google OAuth, dan sinkronisasi progres memerlukan proyek Supabase:

1. Buat proyek Supabase, lalu salin **Project URL** dan **anon/public key** ke `.env.local` berdasarkan contoh di `.env.example`.
2. Jalankan SQL pada `supabase/schema.sql` di SQL Editor Supabase untuk membuat tabel progres dan kebijakan Row Level Security.
3. Pada Authentication → URL Configuration, atur Site URL ke URL aplikasi dan tambahkan URL pengalihan aplikasi ke daftar redirect yang diizinkan.
4. Aktifkan provider Google pada Authentication → Providers. Buat OAuth client di Google Cloud, lalu masukkan client ID dan client secret ke pengaturan provider Google di Supabase. Jangan menaruh client secret atau service-role key di frontend.
5. Untuk pengembangan lokal, gunakan `http://localhost:5173` sebagai URL aplikasi dan redirect yang diizinkan. Atur provider email sesuai kebutuhan verifikasi akun.
6. Jalankan aplikasi dengan `npm run dev`.

Progres disimpan lokal sebagai cache dan disinkronkan ke tabel `student_progress` berdasarkan ID akun. Kebijakan RLS membatasi setiap siswa untuk membaca dan mengubah progres miliknya sendiri. Jika sinkronisasi gagal, aplikasi menampilkan peringatan dan tetap mempertahankan cache lokal.
