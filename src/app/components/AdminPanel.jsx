'use client';
import { useState } from 'react';
import { FaTrash, FaDownload, FaTimes, FaKey, FaEnvelope } from 'react-icons/fa';

const API_URL = '/api';

export default function AdminPanel({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null); // This will store the JWT after successful login

  // Function to handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setToken(data.token); // Save the JWT to the state
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to perform an admin action (delete or export)
  const handleAction = async (action) => {
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }
    
    // Use the JWT for authorization in the request header
    const headers = { 'Authorization': `Bearer ${token}` };

    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete ALL supporter data? This cannot be undone.')) {
        try {
          const res = await fetch(`${API_URL}/api/admin/delete-all`, { method: 'DELETE', headers });
          if (!res.ok) throw new Error(await res.json().then(d => d.error));
          alert('All data deleted successfully. The page will now reload.');
          window.location.reload();
        } catch (err) {
          setError(err.message);
        }
      }
    }

    if (action === 'export') {
      try {
        const res = await fetch(`${API_URL}/api/admin/export`, { headers });
        if (!res.ok) throw new Error(await res.json().then(d => d.error));
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `supporters-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Close the panel and reset its state
  const handleClose = () => {
    onClose();
    setError('');
    setPassword('');
    setEmail('');
    setToken(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1b5e20]">एडमिन पैनल</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
        </div>

        {/* If not authenticated (no token), show the login form */}
        {!token ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</p>}
            <div>
              <label className="font-semibold text-gray-700 block mb-2">ईमेल:</label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-[#2e7d32]">
                <FaEnvelope className="text-gray-400 mx-3" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-none outline-none" placeholder="admin@example.com" required />
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-2">पासवर्ड:</label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-[#2e7d32]">
                <FaKey className="text-gray-400 mx-3" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border-none outline-none" placeholder="Password" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#2e7d32] text-white font-bold py-3 rounded-lg mt-4 hover:bg-[#1b5e20] transition-colors">Login</button>
          </form>
        ) : (
          // If authenticated, show the action buttons
          <div className="space-y-4">
            <p className="text-center text-green-600 font-bold">Authenticated!</p>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</p>}
            <button onClick={() => handleAction('delete')} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700">
              <FaTrash /> सभी डेटा डिलीट
            </button>
            <button onClick={() => handleAction('export')} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
              <FaDownload /> डेटा एक्सपोर्ट
            </button>
          </div>
        )}
      </div>
    </div>
  );
}