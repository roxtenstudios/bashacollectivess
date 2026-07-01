import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const redirectBasedOnRole = async (user) => {
    if (user) {
      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          navigate('/admin');
        }
      } catch (err) {
        console.error("Error checking role for redirect:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let cred;
      if (isLogin) {
        cred = await loginWithEmail(email, password);
      } else {
        cred = await signupWithEmail(email, password);
      }
      setIsLoginModalOpen(false);
      await redirectBasedOnRole(cred.user);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const cred = await loginWithGoogle();
      setIsLoginModalOpen(false);
      await redirectBasedOnRole(cred.user);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-bgPrimary w-full max-w-md p-8 relative shadow-2xl"
        >
          <button 
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <X size={24} strokeWidth={1} />
          </button>

          <h2 className="font-serif text-3xl text-textPrimary mb-2 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-sans text-xs text-textSecondary text-center mb-8 uppercase tracking-widest">
            {isLogin ? 'Sign in to access your account' : 'Join Basha Collectives'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={16} />
              <input 
                type="email" 
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-border py-3 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-textPrimary transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={16} />
              <input 
                type="password" 
                required
                minLength={6}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-border py-3 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-textPrimary transition-colors"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-textPrimary text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-border flex-1"></div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-textSecondary">OR</span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-white border border-border text-textPrimary font-sans text-xs flex justify-center items-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-sans text-[10px] uppercase tracking-widest text-textSecondary hover:text-textPrimary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
