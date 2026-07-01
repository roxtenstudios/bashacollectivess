import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../services/uploadImage';

export default function BannerForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    imageUrl: '',
    active: true,
    ...initialData
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, 'banners');
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-serif text-xl">{initialData ? 'Edit Banner' : 'Create New Banner'}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm font-medium text-gray-700">Active Status</span>
          <input 
            type="checkbox" 
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 rounded text-black focus:ring-black"
          />
        </label>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image *</label>
          <div className="flex gap-4 items-end">
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" className="h-32 w-48 object-cover rounded-lg border border-gray-200" />
            )}
            <div className="flex-1 flex flex-col gap-2">
              <input 
                type="url" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange}
                placeholder="Or paste an image URL here"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
              <div className="flex items-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {isUploading && <span className="text-sm text-blue-600 whitespace-nowrap">Uploading...</span>}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isUploading || !formData.imageUrl}
          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors font-medium disabled:opacity-50"
        >
          {initialData ? 'Update Banner' : 'Create Banner'}
        </button>
      </div>
    </form>
  );
}
