import { db } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, where, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

const COLLECTION_NAME = 'promotionalBanners';

export const getBanners = async (activeOnly = false) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    let banners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (activeOnly) {
      banners = banners.filter(b => b.active === true);
    }
    
    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

export const saveBanner = async (bannerId, bannerData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, bannerId);
    await setDoc(docRef, {
      ...bannerData,
      updatedAt: serverTimestamp(),
      createdAt: bannerData.createdAt || serverTimestamp()
    }, { merge: true });
    return bannerId;
  } catch (error) {
    console.error("Error saving banner:", error);
    throw error;
  }
};

export const deleteBanner = async (bannerId, imageUrl) => {
  try {
    // 1. Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, bannerId));

    // 2. Delete image from Storage if it exists and is hosted on Firebase Storage
    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
      const storage = getStorage();
      // Extract the path from the URL
      const pathRegex = /o\/(.+?)\?alt=media/i;
      const match = imageUrl.match(pathRegex);
      if (match && match[1]) {
        const decodedPath = decodeURIComponent(match[1]);
        const imageRef = ref(storage, decodedPath);
        await deleteObject(imageRef).catch(err => console.log('Image delete error (might already be deleted):', err));
      }
    }
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

export const reorderBanners = async (orderedBanners) => {
  try {
    const batch = writeBatch(db);
    orderedBanners.forEach((banner, index) => {
      const docRef = doc(db, COLLECTION_NAME, banner.id);
      batch.update(docRef, { order: index });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error reordering banners:", error);
    throw error;
  }
};
