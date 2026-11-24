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

export const isVerifiedTeacherUid = async (uid: string): Promise<boolean> => {
  if (!uid || !firestore) return false;

  try {
    const userSnapshot = await getDoc(doc(firestore, 'users', uid));
    if (userSnapshot.exists() && userSnapshot.data()?.role === 'teacher') return true;

    const settingsSnapshot = await getDoc(doc(firestore, 'settings', 'classroom'));
    if (!settingsSnapshot.exists()) return false;
    const settings = settingsSnapshot.data();
    return (
      (Array.isArray(settings.teacherUids) && settings.teacherUids.includes(uid))
      || (Array.isArray(settings.teacherIds) && settings.teacherIds.includes(uid))
      || settings.teacherUid === uid
      || settings.ownerUid === uid
    );
  } catch (error) {
    console.error('Gagal memverifikasi role guru:', error);
    return false;
  }
};
