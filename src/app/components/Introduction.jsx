'use client';
import { FaUsers, FaBullseye, FaHandshake } from 'react-icons/fa';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const StatCard = ({ icon, number, label, delay }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="bg-gray-100 p-6 rounded-[12px] text-center border-l-4 border-[#2e7d32] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:-translate-y-1">
        <div className="text-4xl text-[#2e7d32] mb-2">{icon}</div>
        <div className="text-4xl font-bold text-[#1b5e20] mb-1">{number}</div>
        <div className="font-semibold text-[#666]">{label}</div>
      </div>
    </div>
  );
};

export default function Introduction() {
  return (
    <section className="py-20 bg-white" id="about">
       <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1b5e20]">मेरा संकल्प</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#2e7d32] to-[#ff9800] mx-auto mt-4 rounded"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="md:col-span-2 text-lg leading-relaxed text-[#333]">
            <p className="mb-4">मैं मुकेश मिश्रा (राजू मिश्रा), तरदहा ग्राम पंचायत के लोनियापुर गाँव का ही एक युवा साथी हूँ। पहली बार ग्राम प्रधान पद के लिए चुनाव लड़ रहा हूँ। मेरा मानना है कि नई सोच और ईमानदार प्रयासों से हम अपने गाँव को नई ऊँचाइयों पर ले जा सकते हैं।</p>
            <p>मैं कोई खोखले वादे नहीं करता, बल्कि ठोस योजनाओं के साथ आपके सामने उपस्थित हुआ हूँ। आइए, मिलकर हमारे गाँव लोनियापुर, पूरेबाबू कुम्हिया और बहेलियापुर का भविष्य सुनिश्चित करें।</p>
          </div>
          <div className="grid gap-6">
            <StatCard icon={<FaUsers />} number="5" label="गाँव" delay={100}/>
            <StatCard icon={<FaBullseye />} number="12+" label="योजनाएं" delay={200}/>
            <StatCard icon={<FaHandshake />} number="100%" label="ईमानदारी" delay={300}/>
          </div>
        </div>
      </div>
    </section>
  );
}