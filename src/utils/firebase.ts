import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
export const isFirebaseConfigured = requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));

const firebaseApp = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseProjectId = firebaseApp?.options.projectId ?? null;

export const loadAccountRole = async (
  uid: string,
): Promise<{ role: 'teacher' | 'student'; roleValue: unknown; profileExists: boolean }> => {
  if (!uid) throw new Error('UID Firebase tidak tersedia untuk memeriksa role.');
  if (!firestore) throw new Error('Firestore belum dikonfigurasi untuk memeriksa role akun.');

  try {
    const userSnapshot = await getDoc(doc(firestore, 'users', uid));
    const roleValue = userSnapshot.data()?.role;
    const role = roleValue === 'teacher' ? 'teacher' : 'student';
    const profileExists = userSnapshot.exists();
    const diagnosticRoleValue = typeof roleValue === 'string'
      ? roleValue
      : roleValue == null
        ? null
        : `[${typeof roleValue}]`;

    console.info('[KimiaLab Auth] Verifikasi role Firestore', {
      projectId: firebaseProjectId,
      documentPath: `users/${uid}`,
      uid,
      profileExists,
      roleValue: diagnosticRoleValue,
      verifiedTeacher: role === 'teacher',
    });

    return { role, roleValue, profileExists };
  } catch (error: unknown) {
    const errorCode = typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : null;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[KimiaLab Auth] Gagal membaca profil role Firestore', {
      projectId: firebaseProjectId,
      documentPath: `users/${uid}`,
      uid,
      errorCode,
      errorMessage,
    });
    throw error;
  }
};

export const isVerifiedTeacherUid = async (uid: string): Promise<boolean> => {
  if (!uid) return false;
  const account = await loadAccountRole(uid);
  return account.role === 'teacher';
};
