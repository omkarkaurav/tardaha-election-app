'use client';
import { useState, useEffect } from 'react';
import { FaStar, FaChevronDown } from 'react-icons/fa';

export default function Hero() {
  const [typedText, setTypedText] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const items = ["मुकेश मिश्रा", "राजू मिश्रा", "प्रिंस टेंट हाउस"];

  useEffect(() => {
    const handleScroll = () => setScrollOffset(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let i = 0, char = 0, isDel = false;
    const type = () => {
      const cur = items[i]; setCurrentItem(cur); setActiveIndex(i);
      let text = isDel ? cur.substring(0, char - 1) : cur.substring(0, char + 1); setTypedText(text);
      char = isDel ? char - 1 : char + 1;
      let speed = isDel ? 75 : 150;
      if (!isDel && char === cur.length) { speed = 2000; isDel = true; }
      else if (isDel && char === 0) { isDel = false; i = (i + 1) % items.length; speed = 500; }
      setTimeout(type, speed);
    };
    const id = setTimeout(type, 1000); return () => clearTimeout(id);
  }, []);

  return (
    <header className="hero min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white overflow-hidden" id="home">
      <div className="absolute inset-0 z-0">
        <div className="absolute w-20 h-20 top-[10%] left-[10%] bg-white/10 rounded-full" style={{ transform: `translateY(${scrollOffset * 0.5}px)` }}></div>
        <div className="absolute w-32 h-32 top-[20%] right-[10%] bg-white/10 rounded-full" style={{ transform: `translateY(${scrollOffset * 0.6}px)` }}></div>
        <div className="absolute w-16 h-16 bottom-[20%] left-[20%] bg-white/10 rounded-full" style={{ transform: `translateY(${scrollOffset * 0.7}px)` }}></div>
        <div className="absolute w-24 h-24 bottom-[10%] right-[20%] bg-white/10 rounded-full" style={{ transform: `translateY(${scrollOffset * 0.8}px)` }}></div>
        <div className="absolute w-20 h-20 top-1/2 left-[5%] bg-white/10 rounded-full" style={{ transform: `translateY(${scrollOffset * 0.9}px)` }}></div>
      </div>
      <div className="container mx-auto px-5 z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
          <div className="flex-shrink-0">
            <div className="w-52 h-52 md:w-64 md:h-64 p-2 rounded-full bg-gradient-to-br from-[#ff9800] to-white photo-float-animation">
              <img src="/photo.jpg" alt="उम्मीदवार का फोटो" className="w-full h-full rounded-full object-cover border-4 border-white" />
            </div>
            <div className="mt-4 inline-flex items-center gap-2 bg-[#ff9800] text-white py-2 px-5 rounded-full font-semibold pulse-animation">
              <FaStar /><span>पहली बार उम्मीदवार</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 shadow-lg">
              <div className="text-3xl md:text-5xl font-bold min-h-[80px] flex justify-center md:justify-start items-center">
                <span>{typedText}</span><span className="w-1 h-10 bg-[#ff9800] ml-2 blink-animation"></span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
                <div className="font-semibold text-[#ff9800]">{currentItem}</div>
                <div className="flex gap-2">{items.map((_, idx) => (<div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeIndex === idx ? 'bg-[#ff9800] scale-125' : 'bg-white/30'}`}></div>))}</div>
              </div>
            </div>
            <p className="text-xl md:text-2xl italic opacity-90 mb-4">"नया विजन, नई ऊर्जा - हमारे गाँव का समग्र विकास"</p>
            <p className="text-lg md:text-xl opacity-80 mb-8">ग्राम प्रधान पद के उम्मीदवार</p>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-[12px]">
              <h3 className="text-2xl font-bold mb-2">तरदहा ग्राम पंचायत</h3>
              <p className="mb-4">निम्नलिखित गाँव इस पंचायत में शामिल हैं:</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">{['तरदहा', 'लोनियापुर', 'पूरेबाबू', 'कुम्हिया', 'बहेलियापुर'].map(v => (<span key={v} className="bg-white/30 py-2 px-5 rounded-full font-semibold hover:bg-white/50 hover:-translate-y-0.5 transition-transform cursor-pointer">{v}</span>))}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl z-10"><a href="#about" className="bounce-animation inline-block"><FaChevronDown /></a></div>
    </header>
  );
}