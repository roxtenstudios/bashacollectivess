import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Tag, 
  Settings, 
  MessageSquare, 
  Image,
  LogOut,
  MonitorPlay
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Catalogue', path: '/admin/catalogue', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Tag },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Queries', path: '/admin/queries', icon: MessageSquare },
  { name: 'Banners', path: '/admin/banners', icon: MonitorPlay },
  { name: 'Website Content', path: '/admin/content', icon: Image },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col text-gray-900 shadow-sm z-20">
      <div className="p-6 border-b border-gray-200 flex items-center justify-center h-20">
        <img src="/logo.png" alt="Basha Logo" className="h-8 object-contain" />
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-[#FAF9F6] text-[#D4AF37] border-l-2 border-[#D4AF37]' 
                      : 'text-gray-500 hover:bg-[#FAF9F6] hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 bg-[#FAF9F6]/50">
        <button 
          onClick={logout}
          className="flex items-center gap-3 text-gray-500 hover:text-red-600 w-full px-2 py-2 transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
