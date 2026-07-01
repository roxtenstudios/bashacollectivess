import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ALL_PRODUCTS } from '../Store';

const Catalogue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productsData, setProductsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Apparel',
    price: '',
    stock: '',
    image: '',
    isBestSeller: false,
    isExclusive: false
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductsData(products);
    });

    const qCats = query(collection(db, 'categories'), orderBy('timestamp', 'desc'));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      const cats = snapshot.docs.map(doc => doc.data().name);
      setCategories(cats);
    });

    return () => {
      unsubscribe();
      unsubCats();
    };
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNewProduct({ name: '', category: categories[0] || 'Apparel', price: '', stock: '', image: '', isBestSeller: false, isExclusive: false });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category || categories[0] || 'Apparel',
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      isBestSeller: product.isBestSeller || false,
      isExclusive: product.isExclusive || false
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category || categories[0] || 'Uncategorized',
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        image: newProduct.image,
        isBestSeller: newProduct.isBestSeller,
        isExclusive: newProduct.isExclusive,
        timestamp: serverTimestamp()
      };

      if (editingId) {
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      setIsModalOpen(false);
      setNewProduct({ name: '', category: categories[0] || 'Apparel', price: '', stock: '', image: '', isBestSeller: false, isExclusive: false });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Failed to save product.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm("This will inject 20 dummy products into your database. Continue?")) return;
    setIsSeeding(true);
    try {
      for (const prod of ALL_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          name: prod.title,
          category: prod.category,
          price: parseFloat(prod.price),
          stock: prod.stock || 20,
          image: prod.image,
          desc: prod.desc,
          isBestSeller: false,
          isExclusive: false,
          timestamp: serverTimestamp()
        });
      }
      alert("Database seeded successfully!");
    } catch (err) {
      console.error("Failed to seed database:", err);
      alert("Failed to seed database.");
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredProducts = productsData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Catalogue</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400 text-sm text-gray-900"
            />
          </div>
          <button 
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : 'Seed Database'}
          </button>
          <button 
            onClick={openAddModal}
            className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  {product.image && <img src={product.image} alt={product.name} className="w-8 h-8 rounded-md object-cover" />}
                  {product.name}
                </td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">₹{product.price.toFixed(2)}</td>
                <td className="px-6 py-4 flex gap-2">
                  {product.isBestSeller && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Best Seller</span>}
                  {product.isExclusive && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Exclusive</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {product.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => openEditModal(product)} className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No products found. Add a new product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif text-gray-900 mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                <input 
                  type="text" required
                  value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select 
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                >
                  {categories.length === 0 && <option value="">No Categories Found</option>}
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                  <input 
                    type="number" step="0.01" required min="0"
                    value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Stock Quantity</label>
                  <input 
                    type="number" required min="0"
                    value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                <input 
                  type="url" placeholder="https://example.com/image.jpg"
                  value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                />
              </div>

              <div className="flex gap-4 pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newProduct.isBestSeller} onChange={e => setNewProduct({...newProduct, isBestSeller: e.target.checked})} className="rounded text-gray-900 focus:ring-gray-900" />
                  <span className="text-sm text-gray-700">Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newProduct.isExclusive} onChange={e => setNewProduct({...newProduct, isExclusive: e.target.checked})} className="rounded text-gray-900 focus:ring-gray-900" />
                  <span className="text-sm text-gray-700">Exclusive</span>
                </label>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-black transition-colors mt-4"
              >
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogue;
