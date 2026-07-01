import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The folder path in storage (e.g., 'products', 'categories').
 * @returns {Promise<string>} The download URL of the uploaded image.
 */
export const uploadImage = async (file, path = 'images') => {
  if (!file) return null;
  
  // Create a unique file name to avoid overwriting
  const uniqueName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `${path}/${uniqueName}`);
  
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // We can add progress tracking here if needed later
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
