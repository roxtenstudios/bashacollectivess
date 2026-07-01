import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

const Queries = () => {
  const [queriesData, setQueriesData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'queries'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQueriesData(queries);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (queryId) => {
    try {
      await updateDoc(doc(db, 'queries', queryId), {
        status: 'Read'
      });
    } catch (error) {
      console.error("Error marking query as read: ", error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Customer Queries</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search queries..." 
            className="bg-white border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400 text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queriesData.map((query) => (
              <tr key={query.id} className={`border-b border-gray-100 hover:bg-gray-50 ${query.status === 'Unread' ? 'bg-gray-50' : ''}`}>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{query.customer}</p>
                  <p className="text-xs">{query.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{query.subject}</td>
                <td className="px-6 py-4">{query.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${query.status === 'Unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {query.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  {query.status === 'Unread' && (
                    <button 
                      onClick={() => handleMarkAsRead(query.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-900 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                      title="Mark as Read"
                    >
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <a 
                    href={`mailto:${query.email}?subject=Re: ${query.subject}`}
                    onClick={() => {
                      if (query.status === 'Unread') handleMarkAsRead(query.id);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-black transition-colors"
                  >
                    <Mail size={14} /> Reply
                  </a>
                </td>
              </tr>
            ))}
            {queriesData.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No customer queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queries;
