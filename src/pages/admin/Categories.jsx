import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(cats);
    });
    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), { name: name.trim() });
      } else {
        await addDoc(collection(db, 'categories'), { 
          name: name.trim(),
          timestamp: serverTimestamp() 
        });
      }
      setIsModalOpen(false);
      setName('');
      setEditingId(null);
    } catch (error) {
      console.error("Error saving category: ", error);
      alert("Failed to save category.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? Products using this category might not display correctly unless updated.")) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (error) {
        console.error("Error deleting category: ", error);
      }
    }
  };

  const handleSeedCategories = async () => {
    setIsSeeding(true);
    const defaultCats = ['Banarasi', 'Chiffon', 'Kanjeevaram', 'Silk', 'Georgette'];
    try {
      for (const cat of defaultCats) {
        await addDoc(collection(db, 'categories'), { 
          name: cat,
          timestamp: serverTimestamp() 
        });
      }
      alert("Default categories seeded successfully!");
    } catch (error) {
      console.error("Error seeding categories:", error);
      alert("Failed to seed categories.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Categories</h1>
        <div className="flex gap-4">
          {categories.length === 0 && (
            <button 
              onClick={handleSeedCategories}
              disabled={isSeeding}
              className="bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSeeding ? 'Seeding...' : 'Seed Default Categories'}
            </button>
          )}
          <button 
            onClick={openAddModal}
            className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-3xl">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => openEditModal(cat)} className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                  No categories found. Add a new category to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif text-gray-900 mb-6">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category Name</label>
                <input 
                  type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-black transition-colors mt-4"
              >
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
