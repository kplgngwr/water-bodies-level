import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

let app: FirebaseApp | undefined;
let database: Database | undefined;

export function getFirebaseApp(): FirebaseApp | undefined {
  if (app) return app;
  if (!firebaseConfig.apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase configuration is missing. Skipping initialization.');
    }
    return undefined;
  }

  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseDatabase(): Database | undefined {
  if (database) return database;
  const appInstance = getFirebaseApp();
  if (!appInstance) return undefined;
  database = getDatabase(appInstance);
  return database;
}
