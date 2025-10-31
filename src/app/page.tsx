'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Hero from '@/app/components/Hero';
import Introduction from '@/app/components/Introduction';
import Honesty from '@/app/components/Honesty';
import VillageMotif from '@/app/components/VillageMotif';
import Promises from '@/app/components/Promises';
import CTA from '@/app/components/CTA';
import Support from '@/app/components/Support';
import Footer from '@/app/components/Footer';
import MobileNav from '@/app/components/MobileNav';
import AdminPanel from '@/app/components/AdminPanel';
import { FaCog } from 'react-icons/fa';

export default function Home() {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Set up the keyboard shortcut listener to open the admin panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminPanelOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
      <Introduction />
      <Honesty />
      <VillageMotif />
      <Promises />
      <CTA />
      <Support />
      <Footer />
      <MobileNav />

      {/* Render the Admin Panel and its trigger button */}
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
      
      <button
        onClick={() => setIsAdminPanelOpen(true)}
        className="fixed bottom-20 right-5 md:bottom-5 md:right-5 w-14 h-14 bg-gradient-to-br from-[#ff9800] to-[#f57c00] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Open Admin Panel"
      >
        <FaCog className="text-2xl" />
      </button>
    </main>
  );
}