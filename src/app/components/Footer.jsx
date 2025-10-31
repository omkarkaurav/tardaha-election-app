import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';

const FooterSection = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-bold mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#ff9800]">
      {title}
    </h3>
    {children}
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#1b5e20] text-white pt-16 pb-8" id="contact">
      <div className="container mx-auto px-5">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <FooterSection title="संपर्क करें">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><FaEnvelope className="text-[#ff9800]" /> <span>mm3757275@gmail.com</span></div>
              <div className="flex items-center gap-3"><FaPhone className="text-[#ff9800]" /> <span>+91 6306778181</span></div>
              <div className="flex items-center gap-3"><FaMapMarkerAlt className="text-[#ff9800]" /> <span>तरदहा ग्राम पंचायत, उत्तर प्रदेश</span></div>
            </div>
          </FooterSection>
          <FooterSection title="हमें फॉलो करें">
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/16SEYMgMjx/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff9800] hover:-translate-y-1 transition-all"><FaFacebookF /></a>
              <a href="https://www.instagram.com/mukeshmishra9397?igsh=cmVxYjh5aW0yeDVs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ff9800] hover:-translate-y-1 transition-all"><FaInstagram /></a>
            </div>
          </FooterSection>
          <FooterSection title="गाँव">
            <div className="flex flex-col gap-2">
              {['तरदहा', 'लोनियापुर', 'पूरेबाबू', 'कुम्हिया', 'बहेलियापुर'].map(v => (<span key={v} className="pb-1 border-b border-white/10">{v}</span>))}
            </div>
          </FooterSection>
        </div>
        <div className="text-center pt-8 border-t border-white/10 text-white/70">
          <p>&copy; 2026 मुकेश मिश्रा (राजू मिश्रा) - तरदहा ग्राम पंचायत प्रधान उम्मीदवार | सभी अधिकार सुरक्षित</p>
        </div>
      </div>
    </footer>
  );
}