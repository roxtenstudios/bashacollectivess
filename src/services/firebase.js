import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiJTvbwbd7_SSoU2l7Rp3bM9ir6f4tROg",
  authDomain: "basha-collectives-ec33b.firebaseapp.com",
  projectId: "basha-collectives-ec33b",
  storageBucket: "basha-collectives-ec33b.firebasestorage.app",
  messagingSenderId: "288222347748",
  appId: "1:288222347748:web:441cd21da906f68f5b47f1",
  measurementId: "G-C47LHLX48E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (Only works in browser environments, not SSR)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
