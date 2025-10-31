'use client';
import { useState } from 'react';
import { FaTrash, FaDownload, FaTimes, FaKey } from 'react-icons/fa';

const API_URL = 'http://localhost:3001';

export default function AdminPanel({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd verify the password against the backend.
    // Here, we just set it for the subsequent API calls.
    setIsAuthenticated(true);
    setError('');
  };

  const handleAction = async (action) => {
    if (!password) {
      alert('Password is required to perform actions.');
      return;
    }

    const headers = { 'x-admin-password': password };
    let confirmed = false;

    if (action === 'delete') {
      confirmed = window.confirm('Are you sure you want to delete ALL supporter data? This cannot be undone.');
      if (confirmed) {
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
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1b5e20]">एडमिन पैनल</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit}>
            <label className="font-semibold text-gray-700 block mb-2">एडमिन पासवर्ड डालें:</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-[#2e7d32]">
              <FaKey className="text-gray-400 mx-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-none outline-none"
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#2e7d32] text-white font-bold py-3 rounded-lg mt-4 hover:bg-[#1b5e20] transition-colors">
              Authenticate
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
            <button onClick={() => handleAction('delete')} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
              <FaTrash /> सभी डेटा डिलीट
            </button>
            <button onClick={() => handleAction('export')} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
              <FaDownload /> डेटा एक्सपोर्ट
            </button>
          </div>
        )}
      </div>
    </div>
  );
}