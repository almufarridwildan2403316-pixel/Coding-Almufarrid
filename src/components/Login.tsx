import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
} from 'firebase/auth';
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  CheckCircle2,
  Eye,
  EyeOff,
  FlaskConical,
  LockKeyhole,
  Mail,
  UserRound,
  Zap,
} from 'lucide-react';
import { firebaseAuth, isFirebaseConfigured } from '../utils/firebase';
import './Login.css';

type AuthMode = 'login' | 'register' | 'forgot' | 'recovery';

const logAuthError = (action: string, error: unknown) => {
  const errorCode = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : null;
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[KimiaLab Auth] ${action} gagal`, { errorCode, errorMessage });
};

const getAuthErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    switch (error.code) {
      case 'auth/invalid-api-key':
        return 'Konfigurasi Firebase tidak valid. Periksa API key dan konfigurasi Web App di .env.local.';
      case 'auth/operation-not-allowed':
        return 'Metode login ini belum diaktifkan. Aktifkan Email/Password atau Google di Firebase Authentication.';
      case 'auth/configuration-not-found':
        return 'Firebase Authentication belum disiapkan untuk proyek ini. Aktifkan metode login di Firebase Console, atau lanjutkan sebagai tamu.';
      case 'auth/unauthorized-domain':
        return 'Domain aplikasi belum diizinkan. Tambahkan domain ini di Firebase Authentication → Settings → Authorized domains.';
      case 'auth/invalid-credential':
        return 'Email atau kata sandi salah, atau kredensial tidak valid.';
      case 'auth/user-disabled':
        return 'Akun ini dinonaktifkan. Hubungi pengelola aplikasi.';
      case 'auth/email-already-in-use':
        return 'Email sudah terdaftar. Silakan masuk atau gunakan fitur lupa kata sandi.';
      case 'auth/weak-password':
        return 'Kata sandi terlalu lemah. Gunakan sedikitnya 8 karakter.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan. Tunggu beberapa saat sebelum mencoba lagi.';
      case 'auth/network-request-failed':
        return 'Tidak dapat terhubung ke Firebase. Periksa koneksi internet lalu coba lagi.';
      case 'auth/popup-blocked':
        return 'Popup login Google diblokir browser. Coba izinkan popup atau gunakan login dengan redirect.';
      case 'auth/popup-closed-by-user':
        return 'Jendela login Google ditutup sebelum proses selesai.';
      case 'auth/account-exists-with-different-credential':
        return 'Email ini sudah terdaftar dengan metode login lain. Masuk menggunakan metode sebelumnya, lalu hubungkan Google dari pengaturan akun.';
      case 'auth/invalid-action-code':
        return 'Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan baru.';
      default:
        return error instanceof Error ? `${error.message} (${error.code})` : `Firebase Auth: ${error.code}`;
    }
  }

  return error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba kembali.';
};

interface LoginProps {
  isPasswordRecovery: boolean;
  onPasswordUpdated: () => void;
  onContinueAsGuest: () => void;
}

export const Login = ({ isPasswordRecovery, onPasswordUpdated, onContinueAsGuest }: LoginProps) => {
  const [mode, setMode] = useState<AuthMode>(isPasswordRecovery ? 'recovery' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!firebaseAuth) return;

    let active = true;
    void getRedirectResult(firebaseAuth)
      .catch((caughtError) => {
        if (active) {
          logAuthError('Login Google melalui redirect', caughtError);
          setError(getAuthErrorMessage(caughtError));
        }
      })
      .finally(() => {
        if (active) setBusy(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
    setPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!firebaseAuth) {
      setError('Autentikasi belum siap. Lengkapi konfigurasi Firebase di file .env.local.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    setBusy(true);
    try {
      const activeMode = isPasswordRecovery ? 'recovery' : mode;
      const normalizedEmail = email.trim().toLowerCase();
      if (activeMode === 'login') {
        await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
      } else if (activeMode === 'register') {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
        await updateProfile(credential.user, { displayName: name.trim() });
      } else if (activeMode === 'forgot') {
        await sendPasswordResetEmail(firebaseAuth, normalizedEmail, {
          url: window.location.origin,
        });
        setMessage('Jika alamat email terdaftar, tautan untuk mengatur ulang kata sandi akan dikirim ke email tersebut.');
      } else {
        const actionCode = new URLSearchParams(window.location.search).get('oobCode');
        if (!actionCode) throw new Error('Tautan pemulihan tidak valid atau sudah kedaluwarsa.');
        await confirmPasswordReset(firebaseAuth, actionCode, password);
        window.history.replaceState({}, document.title, window.location.pathname);
        setMode('login');
        setPassword('');
        setMessage('Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.');
        onPasswordUpdated();
      }
    } catch (caughtError) {
      logAuthError('Aksi autentikasi email', caughtError);
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    if (!firebaseAuth) {
      setError('Autentikasi belum siap. Lengkapi konfigurasi Firebase di file .env.local.');
      return;
    }

    setBusy(true);
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    } catch (caughtError) {
      if (typeof caughtError === 'object' && caughtError !== null && 'code' in caughtError) {
        const code = caughtError.code;
        if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
          try {
            await signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
            return;
          } catch (redirectError) {
            logAuthError('Login Google melalui redirect', redirectError);
            setError(getAuthErrorMessage(redirectError));
          }
        } else {
          logAuthError('Login Google', caughtError);
          setError(getAuthErrorMessage(caughtError));
        }
      } else {
        logAuthError('Login Google', caughtError);
        setError(getAuthErrorMessage(caughtError));
      }
      setBusy(false);
    }
  };

  const activeMode = isPasswordRecovery ? 'recovery' : mode;
  const isRecovery = activeMode === 'recovery';
  const isForgot = activeMode === 'forgot';
  const isRegister = activeMode === 'register';
  const title = isRecovery
    ? 'Buat kata sandi baru'
    : isForgot
      ? 'Atur ulang kata sandi'
      : isRegister
        ? 'Buat akun siswa'
        : 'Selamat datang kembali';
  const description = isRecovery
    ? 'Gunakan kata sandi baru untuk mengamankan akun belajar Anda.'
    : isForgot
      ? 'Masukkan email akun Anda. Kami akan mengirimkan tautan pemulihan jika email terdaftar.'
      : isRegister
        ? 'Daftar untuk menyimpan progres praktikum, lembar kerja, dan hasil evaluasi.'
        : 'Masuk dan lanjutkan perjalanan belajar kimia Anda.';

  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-label="Materi larutan elektrolit dan nonelektrolit">
        <div className="auth-showcase__brand">
          <div className="auth-brand-mark"><FlaskConical size={22} strokeWidth={2.2} /></div>
          <span>Kimia<span className="auth-brand-accent">Lab</span></span>
        </div>

        <div className="auth-showcase__content">
          <div className="auth-eyebrow"><Atom size={15} /> LABORATORIUM VIRTUAL KIMIA</div>
          <h1>Kenali Larutan<br /><span>Elektrolit & Nonelektrolit</span></h1>
          <p>Amati bagaimana ion dalam larutan menghantarkan listrik melalui simulasi praktikum yang interaktif.</p>

          <div className="auth-experiment" aria-label="Ilustrasi perbandingan uji daya hantar tiga jenis larutan">
            <div className="auth-experiment__wires" aria-hidden="true">
              <span className="auth-wire auth-wire--left" />
              <span className="auth-wire auth-wire--right" />
              <span className="auth-wire auth-wire--bridge" />
            </div>
            <div className="auth-battery"><Zap size={16} fill="currentColor" /><span>Sumber listrik</span></div>
            <div className="auth-test-row">
              <div className="auth-test-card auth-test-card--strong">
                <div className="auth-bulb auth-bulb--bright"><span /></div>
                <div className="auth-vessel">
                  <i className="auth-ion auth-ion--plus">+</i><i className="auth-ion auth-ion--minus">−</i>
                  <i className="auth-ion auth-ion--plus">+</i><i className="auth-ion auth-ion--minus">−</i>
                  <i className="auth-ion auth-ion--plus">+</i>
                </div>
                <strong>Elektrolit kuat</strong><small>Lampu terang</small>
              </div>
              <div className="auth-test-card auth-test-card--weak">
                <div className="auth-bulb auth-bulb--dim"><span /></div>
                <div className="auth-vessel">
                  <i className="auth-ion auth-ion--plus">+</i><i className="auth-molecule">○</i>
                  <i className="auth-ion auth-ion--minus">−</i><i className="auth-molecule">○</i>
                </div>
                <strong>Elektrolit lemah</strong><small>Lampu redup</small>
              </div>
              <div className="auth-test-card auth-test-card--none">
                <div className="auth-bulb auth-bulb--off"><span /></div>
                <div className="auth-vessel">
                  <i className="auth-molecule">○</i><i className="auth-molecule">○</i>
                  <i className="auth-molecule">○</i><i className="auth-molecule">○</i>
                </div>
                <strong>Nonelektrolit</strong><small>Lampu padam</small>
              </div>
            </div>
            <div className="auth-experiment__note">Model visual kualitatif · bukan hasil pengukuran nyata</div>
          </div>
        </div>
        <div className="auth-showcase__footer">Belajar konsep kimia melalui eksplorasi dan bukti.</div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <div className="auth-brand-mark"><FlaskConical size={20} /></div>
            <span>Kimia<span className="auth-brand-accent">Lab</span></span>
          </div>

          <div className="auth-form-heading">
            <span className="auth-form-kicker">{isRecovery ? 'PEMULIHAN AKUN' : 'RUANG BELAJAR SISWA'}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="auth-config-warning" role="status">
              Firebase belum dikonfigurasi. Tambahkan seluruh variabel <code>VITE_FIREBASE_*</code> yang tercantum di <code>.env.example</code> ke <code>.env.local</code>.
            </div>
          )}

          {!isRecovery && !isForgot && (
            <>
              <button
                className="auth-google-button"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={busy || !isFirebaseConfigured}
              >
                <svg aria-hidden="true" viewBox="0 0 48 48" className="auth-google-icon">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4)" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.47-4.13 7.12-10.2 7.12-17.58Z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 -2)" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.65-5.93c-2.13 1.43-4.86 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                </svg>
                Lanjutkan dengan Google
              </button>
              <div className="auth-divider"><span>atau lanjutkan dengan email</span></div>
            </>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Nama lengkap</span>
                <span className="auth-input-wrap">
                  <UserRound size={18} aria-hidden="true" />
                  <input
                    autoComplete="name"
                    maxLength={80}
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Masukkan nama lengkap"
                  />
                </span>
              </label>
            )}

            {!isRecovery && (
              <label className="auth-field">
                <span>Email</span>
                <span className="auth-input-wrap">
                  <Mail size={18} aria-hidden="true" />
                  <input
                    autoComplete="email"
                    autoFocus={!isRegister}
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@email.com"
                  />
                </span>
              </label>
            )}

            {!isForgot && (
              <label className="auth-field">
                <span>{isRecovery ? 'Kata sandi baru' : 'Kata sandi'}</span>
                <span className="auth-input-wrap">
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    autoComplete={isRecovery || isRegister ? 'new-password' : 'current-password'}
                    minLength={8}
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    className="auth-password-toggle"
                    type="button"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
            )}

            {activeMode === 'login' && (
              <div className="auth-forgot-row">
                <button type="button" className="auth-text-button" onClick={() => changeMode('forgot')}>
                  Lupa kata sandi?
                </button>
              </div>
            )}

            {error && <p className="auth-feedback auth-feedback--error" role="alert">{error}</p>}
            {message && <p className="auth-feedback auth-feedback--success" role="status"><CheckCircle2 size={17} />{message}</p>}

            <button className="auth-submit" type="submit" disabled={busy || !isFirebaseConfigured}>
              <span>{busy ? 'Memproses…' : isRecovery ? 'Simpan kata sandi baru' : isForgot ? 'Kirim tautan pemulihan' : isRegister ? 'Buat akun' : 'Masuk ke KimiaLab'}</span>
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch">
            {isRecovery ? (
              <span>Jika tautan kedaluwarsa, kembali ke halaman login untuk meminta tautan baru.</span>
            ) : isForgot ? (
              <button type="button" className="auth-back-button" onClick={() => changeMode('login')}><ArrowLeft size={16} /> Kembali ke login</button>
            ) : isRegister ? (
              <span>Sudah memiliki akun? <button type="button" className="auth-text-button" onClick={() => changeMode('login')}>Masuk</button></span>
            ) : (
              <span>Belum memiliki akun? <button type="button" className="auth-text-button" onClick={() => changeMode('register')}>Daftar sekarang</button></span>
            )}
          </div>

          {!isRecovery && (
            <button
              className="auth-guest-button"
              type="button"
              onClick={onContinueAsGuest}
              disabled={busy}
            >
              Lanjutkan sebagai tamu
            </button>
          )}

          <p className="auth-privacy-note">Progres tamu tersimpan di browser ini; masuk akun untuk sinkronisasi Firebase.</p>
          <div className="auth-secure-note"><LockKeyhole size={14} /> Login akun dan sinkronisasi menggunakan Firebase</div>
        </div>
      </section>
    </main>
  );
};
