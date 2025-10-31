'use client';
import { useState } from 'react';
import { FaDownload, FaSpinner } from 'react-icons/fa';

export default function CTA() {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => { setIsLoading(true); setTimeout(() => setIsLoading(false), 3000); };
  return (
    <section className="py-20 bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white text-center">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-bold mb-4">आइए मिलकर बदलाव लाएं</h2>
        <p className="text-xl opacity-90 mb-8">तरदहा ग्राम पंचायत के लिए हमारी संपूर्ण ग्राम विकास योजना देखें</p>
        <button onClick={handleClick} disabled={isLoading} className="bg-[#ff9800] text-white font-bold py-4 px-8 rounded-full text-lg inline-flex items-center justify-center gap-3 hover:bg-[#f57c00] hover:-translate-y-1 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
          {isLoading ? (<><FaSpinner className="spin-animation" /><span>जल्द ही उपलब्ध होगा!</span></>) : (<><FaDownload /><span>योजना डाउनलोड करें</span></>)}
        </button>
      </div>
    </section>
  );
}