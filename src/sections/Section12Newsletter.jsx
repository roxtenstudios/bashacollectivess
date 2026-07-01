import { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Section12Newsletter() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'queries'), {
        customer: formData.name,
        email: formData.email,
        subject: formData.message || 'General Inquiry',
        date: new Date().toLocaleDateString(),
        status: 'Unread',
        timestamp: serverTimestamp()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="w-full bg-bgPrimary relative z-20 py-16 md:py-24 flex flex-col items-center justify-center px-6 border-t border-border/30">
      <div className="max-w-2xl w-full flex flex-col items-center text-center gap-8">
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-serif text-3xl md:text-4xl text-textPrimary"
        >
          Stay Close.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-sans font-light text-sm text-textSecondary max-w-sm"
        >
          Join our private list for early access to editions, journal entries, and exclusive invitations.
        </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col gap-4 mt-4"
          >
            <input 
              type="text" 
              placeholder="Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/5 hover:bg-black/10 focus:bg-black/10 px-6 py-4 font-sans font-light text-sm text-textPrimary placeholder:text-textSecondary/70 outline-none transition-colors"
              required
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/5 hover:bg-black/10 focus:bg-black/10 px-6 py-4 font-sans font-light text-sm text-textPrimary placeholder:text-textSecondary/70 outline-none transition-colors"
              required
            />
            <textarea 
              placeholder="Message (Optional)" 
              rows="3"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-black/5 hover:bg-black/10 focus:bg-black/10 px-6 py-4 font-sans font-light text-sm text-textPrimary placeholder:text-textSecondary/70 outline-none resize-none transition-colors"
            ></textarea>
          
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full font-sans text-xs tracking-widest uppercase py-4 mt-2 border border-border hover:bg-textPrimary hover:text-bgPrimary transition-colors duration-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : success ? 'Received!' : 'Submit'}
            </button>
          </motion.form>

      </div>
    </section>
  );
}
