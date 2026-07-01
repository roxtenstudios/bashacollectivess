import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiJTvbwbd7_SSoU2l7Rp3bM9ir6f4tROg",
  authDomain: "basha-collectives-ec33b.firebaseapp.com",
  projectId: "basha-collectives-ec33b",
  storageBucket: "basha-collectives-ec33b.firebasestorage.app",
  messagingSenderId: "288222347748",
  appId: "1:288222347748:web:441cd21da906f68f5b47f1",
  measurementId: "G-C47LHLX48E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const q = collection(db, 'orders');
    const snapshot = await getDocs(q);
    console.log("Found orders count:", snapshot.size);
    snapshot.docs.slice(0, 3).forEach(doc => {
      console.log("ID:", doc.id, JSON.stringify(doc.data(), null, 2));
    });
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
