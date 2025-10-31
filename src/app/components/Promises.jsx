'use client';
import { useState, useEffect } from 'react';
import { FaRoad, FaLightbulb, FaTint, FaBasketballBall, FaBriefcase, FaGraduationCap, FaUtensils, FaFirstAid, FaCheck, FaEquals } from 'react-icons/fa';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ShimmerCard from './ShimmerCard'; // <-- NEW: Import the shimmer component

const PromiseCard = ({ icon, title, description, details, delay }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="bg-white h-full rounded-[12px] p-8 shadow-[0_4px_6px_rgba(0,0,0,0.1)] border-t-4 border-t-[#2e7d32] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-all before:duration-500 hover:before:left-full">
            <div className="text-5xl text-[#2e7d32] text-center mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-[#1b5e20] text-center mb-2">{title}</h3>
            <p className="text-[#666] text-center mb-6">{description}</p>
            <div className="space-y-3 mb-6">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100">
                  <FaCheck className="text-[#2e7d32] mt-1 flex-shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-[#1565c0] to-blue-400 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-center">
              <FaEquals />
              <span>काम सभी गाँवों में समान रूप से होगा</span>
            </div>
        </div>
    </div>
  );
};

export default function Promises() {
  const [activeTab, setActiveTab] = useState('development');
  const [isLoading, setIsLoading] = useState(true); // <-- NEW: Add loading state

  const tabs = [
    { id: 'development', label: 'ग्रामीण विकास' },
    { id: 'youth', label: 'युवा और रोजगार' },
    { id: 'education', label: 'शिक्षा और स्वास्थ्य' },
  ];

  const content = {
    development: [
      { icon: <FaRoad />, title: 'सड़कों का निर्माण और मरम्मत', description: 'तरदहा पंचायत के सभी गाँवों में सड़कों का समान विकास', details: ['सभी गाँवों में कच्ची सड़कों को पक्का करवाना', 'हर गाँव में टूटी सड़कों की मरम्मत', 'सभी गाँवों में नालियों का निर्माण'] },
      { icon: <FaLightbulb />, title: 'स्ट्रीट लाइट की व्यवस्था', description: 'तरदहा पंचायत के हर गाँव में पर्याप्त स्ट्रीट लाइट', details: ['हर गाँव में नए स्ट्रीट लाइट लगवाना', 'सभी गाँवों में सोलर लाइट की व्यवस्था', 'हर गाँव में टूटी लाइटों की मरम्मत'] },
      { icon: <FaTint />, title: 'शुद्ध पेयजल की व्यवस्था', description: 'तरदहा पंचायत के हर घर तक शुद्ध पेयजल', details: ['हर गाँव में नए हैंडपंप लगवाना', 'सभी गाँवों में वाटर फिल्टर प्लांट', 'हर गाँव में टूटे हैंडपंप की मरम्मत'] },
    ],
    youth: [
      { icon: <FaBasketballBall />, title: 'युवाओं के लिए खेल मैदान', description: 'तरदहा पंचायत के हर गाँव में आधुनिक खेल मैदान', details: ['हर गाँव में बास्केटबॉल कोर्ट बनवाना', 'सभी गाँवों में क्रिकेट नेट की व्यवस्था', 'हर गाँव में योगा सेंटर स्थापित करना'] },
      { icon: <FaBriefcase />, title: 'रोजगार के अवसर', description: 'तरदहा पंचायत के युवाओं के लिए रोजगार के अवसर', details: ['हर गाँव में कुटीर उद्योग को बढ़ावा', 'सभी गाँवों में डेयरी फार्मिंग यूनिट', 'हर गाँव में हस्तशिल्प केंद्र स्थापित करना'] },
    ],
    education: [
      { icon: <FaGraduationCap />, title: 'शिक्षा प्रोत्साहन योजना', description: 'तरदहा पंचायत के छात्रों के लिए विशेष प्रोत्साहन', details: ['10वीं में अधिक अंक लाने वाले छात्रों को ₹1100', '12वीं में अधिक अंक लाने वाले छात्रों को ₹2100', 'प्रतिवर्ष शैक्षणिक उत्कृष्टता समारोह का आयोजन'] },
      { icon: <FaUtensils />, title: 'उच्चस्तरीय भोजन व्यवस्था', description: 'प्राइमरी और मिडिल स्कूल में पौष्टिक भोजन', details: ['साप्ताहिक मेनू के अनुसार पौष्टिक भोजन', 'स्वच्छता और गुणवत्ता की नियमित जांच', 'विशेष दिनों में फल और अतिरिक्त आहार'] },
      { icon: <FaFirstAid />, title: 'प्राथमिक चिकित्सा व्यवस्था', description: 'पंचायत भवन में आपातकालीन स्वास्थ्य सुविधा', details: ['पंचायत भवन में 24x7 प्राथमिक चिकित्सा किट', 'निःशुल्क दवाइयों की व्यवस्था', 'मासिक स्वास्थ्य जांच शिविर का आयोजन'] },
    ],
  };

  // <-- NEW: Simulate loading when the component mounts or the tab changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // Simulate a 0.7-second loading time

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <section className="py-20 bg-gray-100" id="promises">
        <div className="container mx-auto px-5">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#1b5e20]">गाँव के लिए मेरे विस्तृत वादे</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#2e7d32] to-[#ff9800] mx-auto mt-4 rounded"></div>
              <p className="text-lg text-[#666] mt-2">सभी गाँवों में समान विकास - कोई भेदभाव नहीं</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`py-3 px-8 font-semibold rounded-full border-2 border-[#2e7d32] transition-colors duration-300 ${activeTab === tab.id ? 'bg-[#2e7d32] text-white' : 'text-[#2e7d32] bg-white hover:bg-[#4caf50] hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* <-- NEW: Conditional rendering for shimmer effect */}
              {isLoading ? (
                // Display 3 shimmer cards while loading
                <>
                  <ShimmerCard />
                  <ShimmerCard />
                  <ShimmerCard />
                </>
              ) : (
                // Display the actual promise cards when loading is false
                content[activeTab].map((promise, index) => (
                  <PromiseCard 
                    key={promise.title} 
                    {...promise} 
                    delay={index * 100}
                  />
                ))
              )}
            </div>
        </div>
    </section>
  );
}