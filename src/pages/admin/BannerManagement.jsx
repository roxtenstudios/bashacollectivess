import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getBanners, saveBanner, deleteBanner, reorderBanners } from '../../services/bannerService';
import BannerForm from './BannerForm';
import { Plus, GripVertical, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await getBanners(false); // Fetch all banners, even inactive
      setBanners(data);
    } catch (error) {
      console.error("Failed to load banners", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBanners(items);
    
    try {
      await reorderBanners(items);
    } catch (error) {
      alert("Failed to save new order");
      fetchBanners(); // Revert on failure
    }
  };

  const handleCreateNew = () => {
    setCurrentBanner(null);
    setIsEditing(true);
  };

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    setIsEditing(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm("Are you sure you want to delete this banner? The image will also be permanently deleted from Storage.")) {
      try {
        await deleteBanner(id, imageUrl);
        setBanners(banners.filter(b => b.id !== id));
      } catch (error) {
        alert("Failed to delete banner");
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await saveBanner(banner.id, { active: !banner.active });
      setBanners(banners.map(b => b.id === banner.id ? { ...b, active: !b.active } : b));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const id = currentBanner?.id || Date.now().toString(); // Use a proper UUID in prod, or let Firestore auto-generate
      
      const newBannerData = {
        ...formData,
        order: currentBanner ? currentBanner.order : banners.length,
      };

      await saveBanner(id, newBannerData);
      
      setIsEditing(false);
      fetchBanners();
    } catch (error) {
      alert("Failed to save banner");
    }
  };

  if (loading) return <div className="p-8">Loading banners...</div>;

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Promotional Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the carousel banners displayed on the homepage.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleCreateNew}
            className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors"
          >
            <Plus size={18} />
            Create Banner
          </button>
        )}
      </div>

      {isEditing ? (
        <BannerForm 
          initialData={currentBanner} 
          onSubmit={handleSubmit} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {banners.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <ImageIcon size={48} className="mb-4 text-gray-300" />
              <p>No banners found. Create your first banner to activate the carousel.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="banners">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {banners.map((banner, index) => (
                      <Draggable key={banner.id} draggableId={banner.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div {...provided.dragHandleProps} className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} />
                            </div>
                            
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title} className="w-24 h-16 object-cover rounded border border-gray-200" />
                            ) : (
                              <div className="w-24 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <ImageIcon size={20} className="text-gray-400" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">Banner Image</h4>
                            </div>

                            <div className="flex items-center gap-6 px-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs font-medium text-gray-500">Active</span>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                  <input 
                                    type="checkbox" 
                                    checked={banner.active}
                                    onChange={() => handleToggleActive(banner)}
                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                    style={{
                                      right: banner.active ? 0 : '1.25rem',
                                      borderColor: banner.active ? '#10B981' : '#E5E7EB',
                                    }}
                                  />
                                  <div 
                                    className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"
                                    style={{ backgroundColor: banner.active ? '#10B981' : '#E5E7EB' }}
                                  ></div>
                                </div>
                              </label>

                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEdit(banner)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(banner.id, banner.imageUrl)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      )}
    </div>
  );
}
