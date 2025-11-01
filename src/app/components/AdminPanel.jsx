// src/app/components/AdminPanel.jsx

'use client';
import { useState, useEffect } from 'react';
import { 
  FaTrash, 
  FaDownload, 
  FaTimes, 
  FaKey, 
  FaEnvelope, 
  FaSpinner, 
  FaUser, 
  FaBuilding, 
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaLock // Icon for new section
} from 'react-icons/fa';

const API_URL = '/api';

// Define village names for display
const villageNames = { 
  'tardaha': 'तरदहा', 
  'loniapur': 'लोनियापुर', 
  'purebabu': 'पूरेबाबू', 
  'kumhiya': 'कुम्हिया', 
  'baheliyapur': 'बहेलियापुर' 
};

export default function AdminPanel({ isOpen, onClose }) {
  const [view, setView] = useState('login'); // 'login', 'loading', 'dashboard'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  });
  
  const [supporters, setSupporters] = useState([]);
  const [groupedSupporters, setGroupedSupporters] = useState({});
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [openVillages, setOpenVillages] = useState({});

  // --- NEW State for Change Password ---
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordMessage, setChangePasswordMessage] = useState({ type: '', text: '' });
  // -------------------------------------

  useEffect(() => {
    if (isOpen && token) {
      fetchSupporters();
    } else if (isOpen) {
      setView('login');
      setOpenVillages({});
      setIsChangePasswordOpen(false); // Close accordion on open
    }
  }, [isOpen, token]);

  useEffect(() => {
    const groups = supporters.reduce((acc, supporter) => {
      const village = supporter.village || 'unknown';
      if (!acc[village]) {
        acc[village] = [];
      }
      acc[village].push(supporter);
      return acc;
    }, {});
    setGroupedSupporters(groups);
  }, [supporters]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoadingAction(true);
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
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const fetchSupporters = async () => {
    if (!token) return;
    setView('loading');
    setError('');
    try {
      const res = await adminFetch(`${API_URL}/admin/supporters`, { method: 'GET' });
      
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401 || res.status === 403) {
            handleLogout(); 
            throw new Error(data.error || 'Session expired. Please log in again.');
        }
        throw new Error(data.error || 'Failed to fetch supporters');
      }
      
      const data = await res.json();
      setSupporters(data);
      setView('dashboard');
    } catch (err) {
      setError(err.message);
      setView('login'); 
      setToken(null);
    }
  };

  const handleClose = () => {
    onClose();
    setError('');
    setOpenVillages({});
    setIsChangePasswordOpen(false);
    setChangePasswordMessage({ type: '', text: '' });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setEmail('');
    setPassword('');
    setError('');
    setSupporters([]);
    setOpenVillages({});
    setIsChangePasswordOpen(false);
    setChangePasswordMessage({ type: '', text: '' });
    setView('login');
  }

  const toggleVillage = (villageKey) => {
    setOpenVillages(prev => ({
      ...prev,
      [villageKey]: !prev[villageKey]
    }));
  };

  const adminFetch = (url, options) => {
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      setView('login');
      setToken(null);
      return Promise.reject(new Error('No token'));
    }
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
    return fetch(url, { ...options, headers });
  };

  // --- NEW Handler for Changing Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setChangePasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setIsLoadingAction(true);
    try {
      const res = await adminFetch(`${API_URL}/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      setChangePasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      // Clear fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setChangePasswordMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoadingAction(false);
    }
  };
  // ------------------------------------------

  const handleDeleteSupporter = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} (ID: ${id})?`)) {
      setIsLoadingAction(true);
      setError('');
      try {
        const res = await adminFetch(`${API_URL}/admin/delete-supporter`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error(await res.json().then(d => d.error));
        setSupporters(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingAction(false);
      }
    }
  };

  const handleDeleteVillage = async (villageKey) => {
    const villageName = villageNames[villageKey] || villageKey;
    if (window.confirm(`Are you sure you want to delete ALL ${groupedSupporters[villageKey]?.length || 0} supporters from ${villageName}?`)) {
      setIsLoadingAction(true);
      setError('');
      try {
        const res = await adminFetch(`${API_URL}/admin/delete-village`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ village: villageKey }),
        });
        if (!res.ok) throw new Error(await res.json().then(d => d.error));
        setSupporters(prev => prev.filter(s => s.village !== villageKey));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingAction(false);
      }
    }
  };
  
  const handleDeleteAll = async () => {
      if (window.confirm('DANGER: Are you sure you want to delete ALL supporter data? This cannot be undone.')) {
        setIsLoadingAction(true);
        setError('');
        try {
          const res = await adminFetch(`${API_URL}/admin/delete-all`, { method: 'DELETE' });
          if (!res.ok) throw new Error(await res.json().then(d => d.error));
          alert('All data deleted successfully.');
          setSupporters([]);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoadingAction(false);
        }
      }
  };
  
  const handleExport = async (village = null) => {
      setIsLoadingAction(true);
      setError('');
      try {
        const url = village 
          ? `${API_URL}/admin/export-csv?village=${village}` 
          : `${API_URL}/admin/export-csv`;
          
        const res = await adminFetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(await res.json().then(d => d.error));
        
        const blob = await res.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        
        const disposition = res.headers.get('content-disposition');
        let fileName = `supporters-export-${Date.now()}.csv`;
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
              fileName = matches[1].replace(/['"]/g, '');
            }
        }
        
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingAction(false);
      }
  };


  const renderLogin = () => (
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
      <button type="submit" disabled={isLoadingAction} className="w-full bg-[#2e7d32] text-white font-bold py-3 rounded-lg mt-4 hover:bg-[#1b5e20] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
        {isLoadingAction ? <FaSpinner className="spin-animation" /> : 'Login'}
      </button>
    </form>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-48">
      <FaSpinner className="spin-animation text-4xl text-[#2e7d32]" />
      <p className="mt-4 text-lg font-semibold text-gray-700">Loading Supporter Data...</p>
    </div>
  );
  
  // --- NEW: Form for Changing Password ---
  const renderChangePasswordForm = () => (
    <form onSubmit={handleChangePassword} className="space-y-3 p-4 bg-white border-t">
      {changePasswordMessage.text && (
        <p className={`p-2 rounded-md text-center ${changePasswordMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {changePasswordMessage.text}
        </p>
      )}
      <div>
        <label className="font-semibold text-gray-700 block mb-1 text-sm">Old Password:</label>
        <input 
          type="password" 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)} 
          className="w-full p-2 border-2 border-gray-300 rounded-lg text-base" 
          required 
        />
      </div>
      <div>
        <label className="font-semibold text-gray-700 block mb-1 text-sm">New Password:</label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          className="w-full p-2 border-2 border-gray-300 rounded-lg text-base" 
          required 
        />
      </div>
      <div>
        <label className="font-semibold text-gray-700 block mb-1 text-sm">Confirm New Password:</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className="w-full p-2 border-2 border-gray-300 rounded-lg text-base" 
          required 
        />
      </div>
      <button type="submit" disabled={isLoadingAction} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-2 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
        {isLoadingAction ? <FaSpinner className="spin-animation" /> : 'Save New Password'}
      </button>
    </form>
  );
  // ------------------------------------

  const renderDashboard = () => (
    <div className="space-y-6">
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</p>}
      {isLoadingAction && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/50 z-50 flex items-center justify-center rounded-lg">
            <FaSpinner className="spin-animation text-4xl text-[#2e7d32]" />
        </div>
      )}
      
      <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800">Global Actions</h3>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button onClick={() => handleExport()} disabled={isLoadingAction} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50">
              <FaDownload /> Export All (CSV)
            </button>
            <button onClick={handleDeleteAll} disabled={isLoadingAction} className="flex-1 flex items-center justify-center gap-2 bg-red-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-800 disabled:opacity-50">
              <FaTrash /> Delete ALL Data
            </button>
          </div>
      </div>

      {/* --- NEW: Change Password Accordion --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsChangePasswordOpen(prev => !prev)}
          className="w-full flex justify-between items-center p-3 bg-gray-50 border-b hover:bg-gray-100 transition-colors"
        >
          <h4 className="text-lg font-bold text-[#1b5e20] flex items-center gap-2">
            {isChangePasswordOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
            <FaLock className="ml-1" /> 
            Security
          </h4>
        </button>
        {isChangePasswordOpen && renderChangePasswordForm()}
      </div>
      {/* ------------------------------------- */}
      
      <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
        <h3 className="font-bold text-xl text-gray-800">Supporters by Village ({supporters.length} Total)</h3>
        {Object.keys(groupedSupporters).length === 0 && !isLoadingAction && (
            <p className="text-gray-500 text-center italic py-4">No supporters found.</p>
        )}
        
        {Object.keys(groupedSupporters).sort().map(villageKey => {
          const isOpen = !!openVillages[villageKey];
          
          return (
            <div key={villageKey} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              
              <button 
                onClick={() => toggleVillage(villageKey)} 
                className="w-full flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-50 border-b hover:bg-gray-100 transition-colors"
              >
                <h4 className="text-lg font-bold text-[#1b5e20] flex items-center gap-2">
                  {isOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                  <FaBuilding className="ml-1" /> 
                  {villageNames[villageKey] || villageKey} ({groupedSupporters[villageKey].length})
                </h4>
                
                <div className="flex gap-2 mt-2 sm:mt-0" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => handleExport(villageKey)} 
                    disabled={isLoadingAction} 
                    className="text-xs bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    title={`Export ${villageNames[villageKey] || villageKey}`}
                  >
                    <FaDownload />
                  </button>
                  <button 
                    onClick={() => handleDeleteVillage(villageKey)} 
                    disabled={isLoadingAction} 
                    className="text-xs bg-red-500 text-white p-2 rounded-md hover:bg-red-600 disabled:opacity-50"
                    title={`Delete all from ${villageNames[villageKey] || villageKey}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </button>
              
              {isOpen && (
                <div className="divide-y divide-gray-100 bg-white">
                  {groupedSupporters[villageKey].map(supporter => (
                    <div key={supporter.id} className="p-3 flex justify-between items-start">
                      <div className="text-sm overflow-hidden">
                        <p className="font-bold text-gray-900 flex items-center gap-2"><FaUser /> {supporter.name} <span className="text-xs font-normal text-gray-500">(ID: {supporter.id})</span></p>
                        <p className="text-gray-600"><strong>Contact:</strong> {supporter.contact || 'N/A'}</p>
                        <p className="text-gray-600 break-words"><strong>Comment:</strong> {supporter.comment || 'N/A'}</p>
                        <p className="text-gray-500 text-xs mt-1"><strong>IP:</strong> {supporter.ipAddress} | <strong>At:</strong> {new Date(supporter.createdAt).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteSupporter(supporter.id, supporter.name)} 
                        disabled={isLoadingAction} 
                        className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                        title={`Delete ${supporter.name}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

      </div>
       <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-center text-sm text-gray-600 hover:text-red-500 mt-4 font-semibold">
        <FaSignOutAlt /> Log Out
       </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#1b5e20]">एडमिन पैनल</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800"><FaTimes /></button>
        </div>

        {view === 'login' && renderLogin()}
        {view === 'loading' && renderLoading()}
        {view === 'dashboard' && renderDashboard()}
        
      </div>
    </div>
  );
}