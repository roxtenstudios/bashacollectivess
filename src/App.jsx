import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import SmoothScroll from './components/common/SmoothScroll';
import Preloader from './components/common/Preloader';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import FloatingCart from './components/common/FloatingCart';
import LoginModal from './components/common/LoginModal';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

// Store Pages
import Home from './pages/Home';
import Store from './pages/Store';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Tracking from './pages/Tracking';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Catalogue from './pages/admin/Catalogue';
import Coupons from './pages/admin/Coupons';
import Settings from './pages/admin/Settings';
import Queries from './pages/admin/Queries';
import WebsiteContent from './pages/admin/WebsiteContent';
import Categories from './pages/admin/Categories';
import BannerManagement from './pages/admin/BannerManagement';

// Utility to scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// Layout for the public store
const StoreLayout = ({ children }) => (
  <SmoothScroll>
    <div className="relative opacity-100 transition-opacity duration-1000 ease-in">
      <Header />
      <CartDrawer />
      <FloatingCart />
      <LoginModal />
      {children}
      <Footer />
    </div>
  </SmoothScroll>
);

// Protected Route for Admin
const ProtectedRoute = ({ children }) => {
  const { currentUser, userData, loading, setIsLoginModalOpen } = useAuth();
  
  if (loading) return null;

  if (!currentUser || (userData && userData.role !== 'admin')) {
    if (!currentUser) {
      setTimeout(() => setIsLoginModalOpen(true), 100);
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protected Route for Store Customers
const StoreProtectedRoute = ({ children }) => {
  const { currentUser, loading, setIsLoginModalOpen } = useAuth();
  
  if (loading) return null;

  if (!currentUser) {
    setTimeout(() => setIsLoginModalOpen(true), 100);
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('basha_intro_played');
  });

  // Disable scroll during preloader
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      sessionStorage.setItem('basha_intro_played', 'true');
    }
  }, [loading]);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <ScrollToTop />
        <AnimatePresence>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        <div className={`relative ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 ease-in`}>
          <Routes>
            {/* Admin Routes - No Store Header/Footer */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="catalogue" element={<Catalogue />} />
              <Route path="categories" element={<Categories />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="settings" element={<Settings />} />
              <Route path="queries" element={<Queries />} />
              <Route path="content" element={<WebsiteContent />} />
              <Route path="banners" element={<BannerManagement />} />
            </Route>

            {/* Public Store Routes */}
            <Route path="/*" element={
              <StoreLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/tracking" element={<Tracking />} />
                  <Route path="/tracking/:orderId" element={<Tracking />} />
                  <Route path="/profile" element={<StoreProtectedRoute><Profile /></StoreProtectedRoute>} />
                  <Route path="/profile/:tab" element={<StoreProtectedRoute><Profile /></StoreProtectedRoute>} />
                </Routes>
              </StoreLayout>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
