import { FaHandHoldingHeart } from 'react-icons/fa';

export default function Honesty() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#4caf50] to-[#2e7d32]">
      <div className="container mx-auto px-5">
        <div className="bg-white max-w-4xl mx-auto rounded-[12px] shadow-[0_10px_25px_rgba(0,0,0,0.15)] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="text-7xl text-[#2e7d32] flex-shrink-0"><FaHandHoldingHeart /></div>
          <div>
            <h2 className="text-3xl font-bold text-[#1b5e20] mb-4">मेरी ईमानदारी का वादा</h2>
            <div className="space-y-3 text-lg text-[#333]">
              <p>मैं स्पष्ट रूप से घोषणा करता हूँ कि <strong>मैं दूसरे प्रधानों की तरह पैसा नहीं लूंगा</strong>। मेरा उद्देश्य केवल और केवल गाँव का विकास है।</p>
              <p><strong>हम और आप मिलकर काम करेंगे</strong> - हर निर्णय में आपकी भागीदारी सुनिश्चित करूंगा।</p>
              <p>मेरी कोशिश रहेगी कि गाँव का हर रुपया गाँव के विकास पर ही खर्च हो और पारदर्शिता बनी रहे।</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}