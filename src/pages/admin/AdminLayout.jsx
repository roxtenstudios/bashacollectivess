import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 flex font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="text-lg font-serif">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#D4AF37] border border-[#D4AF37]/20">
              A
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
