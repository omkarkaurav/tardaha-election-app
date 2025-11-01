'use client';
import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaHeart, FaRedo, FaPaperPlane, FaEdit, FaCheckCircle, FaComment, FaWhatsapp, FaFacebookF, FaUsers, FaTrophy, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import Celebration from './Celebration';
import AchievementBadge from './AchievementBadge';
import ShimmerSupporterItem from './ShimmerSupporterItem';

const API_URL = '/api';

// Utility function to calculate relative time
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "अभी अभी";
  if (minutes < 60) return `${minutes} मिनट पहले`;
  if (hours < 24) return `${hours} घंटे पहले`;
  return `${days} दिन पहले`;
}

// Define initial structure for village data state
const initialVillageData = {
  data: [],
  currentPage: 1,
  totalPages: 1,
  isFetching: true
};

export default function Support() {
  const [formData, setFormData] = useState({ name: '', contact: '', comment: '', village: '' });
  const [errors, setErrors] = useState({});
  const [view, setView] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ total: 0 });

  // PAGINATION/LIST STATE: Object mapping villageKey to its list data and pagination
  const [villageData, setVillageData] = useState({});

  const [isStatsLoading, setIsStatsLoading] = useState(true); // Tracks loading for overall stats
  const [showCelebration, setShowCelebration] = useState(false);

  const villageNames = { 'tardaha': 'तरदहा', 'loniapur': 'लोनियापुर', 'purebabu': 'पूरेबाबू', 'kumhiya': 'कुम्हिया', 'baheliyapur': 'बहेलियापुर' };
  const villageKeys = Object.keys(villageNames);

  // New function to fetch paginated list for a specific village
  const fetchSupportersList = async (villageKey, page) => {
    setVillageData(prev => ({
      ...prev,
      [villageKey]: { ...(prev[villageKey] || initialVillageData), isFetching: true }
    }));

    try {
      const res = await fetch(`${API_URL}/recent?village=${villageKey}&page=${page}`);
      if (!res.ok) throw new Error(`Failed to fetch ${villageKey} data`);
      const data = await res.json();

      if (Array.isArray(data.supporters)) {
        setVillageData(prev => ({
          ...prev,
          [villageKey]: {
            data: data.supporters,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            isFetching: false,
          }
        }));
      } else {
        throw new Error("Invalid supporters data format.");
      }
    } catch (error) {
      console.error(`Paginated data fetching error for ${villageKey}:`, error);
      setVillageData(prev => ({
        ...prev,
        [villageKey]: {
          ...(prev[villageKey] || initialVillageData),
          data: [],
          isFetching: false,
          totalPages: 1,
          currentPage: 1
        }
      }));
    }
  };

  // Logic to fetch all data on mount
  useEffect(() => {
    // 1. Initialize village data state with loading status
    const initialData = villageKeys.reduce((acc, key) => {
      acc[key] = initialVillageData;
      return acc;
    }, {});
    setVillageData(initialData);

    // 2. Fetch stats (total counts)
    const fetchStats = async () => {
      setIsStatsLoading(true);
      try {
        const statsRes = await fetch(`${API_URL}/stats`);
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        setStats(prev => ({ ...prev, ...statsData }));
      } catch (error) {
        console.error("Stats fetching error:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchStats();

    // Initial fetch for all villages on page 1
    villageKeys.forEach(key => fetchSupportersList(key, 1));
  }, []);

  const handlePageChange = (villageKey, newPage) => {
    fetchSupportersList(villageKey, newPage);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'कृपया अपना नाम लिखें';
    if (formData.contact && !/^[6-9]d{9}$/.test(formData.contact)) newErrors.contact = 'कृपया सही मोबाइल नंबर लिखें (10 अंक)';
    if (!formData.village) newErrors.village = 'कृपया अपना गाँव चुनें';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    const isFirstSupport = (stats.total || 0) === 0;
    const submittedVillage = formData.village;

    try {
      const res = await fetch(`${API_URL}/supporters`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || (data.error && data.error.includes('already registered'))) {
          throw new Error(data.error);
        }
        throw new Error(data.error || 'Network error during submission');
      }

      // On successful submission, refresh stats and update the specific village list
      setStats(prev => ({ ...prev, total: (prev.total || 0) + 1, [submittedVillage]: (prev[submittedVillage] || 0) + 1 }));
      setMessage(`धन्यवाद ${formData.name}! आपका समर्थन सफलतापूर्वक जोड़ दिया गया है।`);
      setView('success');
      setFormData({ name: '', contact: '', comment: '', village: '' });
      if (isFirstSupport) { setShowCelebration(true); setTimeout(() => setShowCelebration(false), 4000); }

      // IMPORTANT: Fetch the new list for the submitted village to show the update immediately on page 1
      fetchSupportersList(submittedVillage, 1);

    } catch (error) {
      console.error("Submission error:", error);
      if (error.message.includes('already registered')) {
        setMessage(error.message);
      } else {
        setMessage('समर्थन जोड़ने में विफल। कृपया पुनः प्रयास करें।');
      }
      setView('form');
    } finally {
      setIsLoading(false);
      if (!message.includes('already registered')) {
        setTimeout(() => { if (view === 'success') setView('form'); setMessage(''); }, 5000);
      }
    }
  };

  // Helper function to render pagination controls for a single village column
  const renderVillagePagination = (villageKey) => {
    // Use default initial data if the key hasn't been set yet
    const villageState = villageData[villageKey] || initialVillageData;
    const { currentPage, totalPages, isFetching } = villageState;

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100/50 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={() => handlePageChange(villageKey, Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || isFetching}
          className="p-2 rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/20 disabled:opacity-50 transition-colors"
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <span className="text-xs font-semibold text-[#1b5e20]">
          पेज {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(villageKey, Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || isFetching}
          className="p-2 rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/20 disabled:opacity-50 transition-colors"
          aria-label="Next page"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    );
  };

  const renderSupporterItem = (supporter) => (
    <div key={supporter.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border-l-4 border-[#2e7d32] transition-all duration-300 hover:shadow-sm">
      <div className="flex-shrink-0 bg-[#2e7d32] text-white h-9 w-9 rounded-full flex items-center justify-center">
        <FaUser className="text-sm" />
      </div>
      <div className="flex-grow text-left">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-[#1b5e20] text-base leading-none">{supporter.name}</p>
          <p className="text-xs text-[#666] flex-shrink-0 ml-2">{timeAgo(supporter.createdAt)}</p>
        </div>
        {supporter.comment && (
          <blockquote className="text-xs text-[#333] italic mt-1 px-2 py-1 bg-[#ff9800]/10 rounded-md border-l-2 border-[#ff9800] max-w-full overflow-hidden">
            "{supporter.comment}"
          </blockquote>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]" id="support">
      {showCelebration && (<> <Celebration /> <AchievementBadge title="पहले समर्थक!" message="आप इस अभियान के पहले समर्थक हैं!" /> </>)}

      <div className=" mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1b5e20]">जनसमर्थन</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2e7d32] to-[#ff9800] mx-auto mt-4 rounded"></div>
          <p className="text-lg text-[#666] mt-2">आपका एक वोट, गाँव के विकास की एक सीढ़ी</p>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-[0_10px_25px_rgba(0,0,0,0.15)] mb-12 border-4 border-[#4caf50]">
            <FaUsers className="text-7xl text-[#2e7d32] mb-6 pulse-animation mx-auto" />
            <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#2e7d32] to-[#1b5e20]">{stats.total || 0}</div>
            <div className="text-2xl text-[#333] font-bold">लोगों ने जोड़ा समर्थन</div>
          </div>

          {/* Village Stats: Horizontal Grid Layout (Correctly Preserved) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12">
            {Object.keys(villageNames).map(k => (
              <div key={k} className="bg-white p-6 rounded-2xl shadow-[0_4px_6px_rgba(0,0,0,0.1)] border-l-4 border-[#2e7d32] hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-bold text-[#1b5e20]">{stats[k] || 0}</div>
                <div className="font-semibold">{villageNames[k]}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-[0_10px_25px_rgba(0,0,0,0.15)] border-4 border-[#4caf50]">
            {message && (<div className={`p-4 mb-6 rounded-lg font-semibold text-center text-white ${message.includes('विफल') || message.includes('already registered') ? 'bg-red-500' : 'bg-green-500'}`}>{message}</div>)}

            {view === 'form' && (
              <form onSubmit={(e) => { e.preventDefault(); if (validate()) setView('preview'); }} noValidate className="fade-in-animation">
                <h3 className="text-center text-[#1b5e20] mb-8 text-3xl font-bold">अपना समर्थन जोड़ें</h3>
                <div className="mb-6 text-left"><label className="flex items-center gap-3 font-bold text-[#1b5e20] text-lg mb-2"><FaUser />आपका पूरा नाम:<span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 border-2 border-gray-300 rounded-[12px] text-lg" />{errors.name && <div className="text-red-500 mt-2 font-semibold shake-animation">{errors.name}</div>}</div>
                <div className="mb-6 text-left"><label className="flex items-center gap-3 font-bold text-[#1b5e20] text-lg mb-2"><FaPhone />मोबाइल नंबर (वैकल्पिक):</label><input type="tel" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value.replace(/\D/g, '') })} maxLength="10" className="w-full p-4 border-2 border-gray-300 rounded-[12px] text-lg" />{errors.contact && <div className="text-red-500 mt-2 font-semibold shake-animation">{errors.contact}</div>}</div>
                <div className="mb-6 text-left"><label className="flex items-center gap-3 font-bold text-[#1b5e20] text-lg mb-2"><FaComment />आपका संदेश (वैकल्पिक):</label><textarea value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} rows="3" maxLength="200" className="w-full p-4 border-2 border-gray-300 rounded-[12px] text-lg"></textarea></div>
                <div className="mb-6 text-left"><label className="flex items-center gap-3 font-bold text-[#1b5e20] text-lg mb-2"><FaMapMarkerAlt />आपका गाँव:<span className="text-red-500">*</span></label><select value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} className="w-full p-4 border-2 border-gray-300 rounded-[12px] text-lg"><option value="" disabled>-- गाँव चुनें --</option>{Object.keys(villageNames).map(k => <option key={k} value={k}>{villageNames[k]}</option>)}</select>{errors.village && <div className="text-red-500 mt-2 font-semibold shake-animation">{errors.village}</div>}</div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8"><button type="submit" className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#ff9800] to-[#f57c00] text-white font-bold py-4 px-8 rounded-lg text-xl"><FaHeart />समर्थन जोड़ें</button><button type="button" onClick={() => setFormData({ name: '', contact: '', comment: '', village: '' })} className="flex items-center justify-center gap-2 bg-transparent border-2 border-gray-300 text-[#666] font-bold py-4 px-8 rounded-lg text-lg"><FaRedo />साफ करें</button></div>
              </form>
            )}

            {view === 'preview' && (
              <div className="fade-in-animation">
                <div className="text-center mb-6"><FaCheckCircle className="text-5xl text-[#2e7d32] mx-auto mb-3" /><h3 className="text-3xl font-bold text-[#1b5e20]">आपका समर्थन तैयार है</h3></div>
                <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg border-l-4 border-[#2e7d32]"><p><strong>नाम:</strong> {formData.name}</p><p><strong>मोबाइल:</strong> {formData.contact || 'नहीं दिया गया'}</p><p><strong>संदेश:</strong> {formData.comment || 'नहीं दिया गया'}</p><p><strong>गाँव:</strong> {villageNames[formData.village]}</p></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8"><button onClick={handleConfirm} disabled={isLoading} className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white font-bold py-4 px-8 rounded-lg text-xl"><FaPaperPlane />{isLoading ? 'भेज रहा है...' : 'समर्थन भेजें'}</button><button onClick={() => setView('form')} className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#2e7d32] text-[#2e7d32] font-bold py-4 px-8 rounded-lg text-lg"><FaEdit />संपादित करें</button></div>
              </div>
            )}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4"><span>अधिक लोगों तक पहुँचाएं:</span><button className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center text-2xl"><FaWhatsapp /></button><button className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl"><FaFacebookF /></button></div>
        </div>

        {/* MODIFIED: Supporter List Section (Vertical Columns with Pagination) - Clean Redesign */}
        <div className="mt-16  mx-auto">
          <h3 className="text-center text-[#1b5e20] mb-6 text-4xl font-bold">हाल ही में समर्थन जोड़ने वाले</h3>

          {/* Grid Container for Village Columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {villageKeys.map(villageKey => {
              // Use default initial data if the key hasn't been set yet
              const villageState = villageData[villageKey] || initialVillageData;
              const { data: supportersData, isFetching } = villageState;

              return (
                <div key={villageKey} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">

                  {/* Village Header (Clean, Simpler Design) */}
                  <div className="bg-[#e8f5e9] text-[#1b5e20] p-3 text-center text-lg font-bold border-b border-[#c8e6c9] flex items-center justify-center gap-2 flex-shrink-0">
                    <FaMapMarkerAlt className="text-[#4caf50]" /> {villageNames[villageKey]} ({stats[villageKey] || 0})
                  </div>

                  <div className="flex-grow flex flex-col justify-between min-h-[300px]">
                    {/* List or Shimmer/Empty State */}
                    {isFetching ? (
                      <div className="p-4 space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => <ShimmerSupporterItem key={index} />)}
                      </div>
                    ) : supportersData.length > 0 ? (
                      <div className="p-4 space-y-3 overflow-y-auto">
                        {supportersData.map(supporter => renderSupporterItem(supporter))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-[#666] italic">कोई समर्थक नहीं</div>
                    )}

                    {/* Pagination Controls (Sticky at bottom) */}
                    {renderVillagePagination(villageKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Original empty state structure (kept as a fallback) */}
        {isStatsLoading || Object.values(villageData).every(v => !v.isFetching && v.data.length === 0) ? (
          <div className="bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2] border-2 border-[#ff9800] rounded-2xl p-8 text-center max-w-2xl mx-auto mt-16">
            <FaTrophy className="text-5xl text-[#ff9800] mx-auto mb-4 bounce-animation" />
            <h3 className="text-3xl font-bold text-[#e65100] mb-2">पहले समर्थक बनें!</h3>
            <p className="text-lg text-[#bf360c] font-semibold">आप इस अभियान के पहले समर्थक बन सकते हैं। अपना समर्थन जोड़ें और इतिहास रचें!</p>
          </div>
        ) : null}


      </div>
    </section>
  );
}