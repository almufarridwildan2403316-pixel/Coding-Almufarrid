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

## Konfigurasi Firebase

Login email/kata sandi, Google, pemulihan kata sandi, dan sinkronisasi progres menggunakan Firebase Authentication dan Cloud Firestore:

1. Buat proyek Firebase dan daftarkan aplikasi web. Salin konfigurasi aplikasi ke `.env.local` berdasarkan nama variabel pada `.env.example`. Nilai konfigurasi web Firebase digunakan di frontend; jangan menaruh service-account key di aplikasi.
2. Pada Firebase Console → Authentication → Sign-in method, aktifkan **Email/Password** dan **Google**.
3. Pada Authentication → Settings → Authorized domains, pastikan domain aplikasi dan `localhost` tersedia. Template email reset kata sandi diatur dari Authentication → Templates.
4. Buat database Cloud Firestore. Terapkan aturan dari `firebase/firestore.rules` melalui Firebase Console → Firestore Database → Rules.
5. Untuk pengembangan lokal, gunakan `http://localhost:5173`, lalu jalankan `npm run dev`.

Progres disimpan lokal sebagai cache dan disinkronkan ke dokumen `studentProgress/{uid}`. Aturan Firestore membatasi akses dokumen hanya kepada pemilik akun. Jika sinkronisasi gagal, aplikasi menampilkan peringatan dan tetap mempertahankan cache lokal.
