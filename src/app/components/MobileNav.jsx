'use client';
import { useState, useEffect } from 'react';
import { FaHome, FaUser, FaHandshake, FaPhone } from 'react-icons/fa';
import Link from 'next/link';

const navItems = [
    { href: '#home', icon: <FaHome />, label: 'होम' },
    { href: '#about', icon: <FaUser />, label: 'परिचय' },
    { href: '#promises', icon: <FaHandshake />, label: 'वादे' },
    { href: '#contact', icon: <FaPhone />, label: 'संपर्क' },
];

export default function MobileNav() {
    const [activeSection, setActiveSection] = useState('#home');

    useEffect(() => {
        // This function finds the currently visible section and updates the state.
        const handleScroll = () => {
            let currentSection = '#home';
            // Iterate over each nav item to check its corresponding section's position
            for (const item of navItems) {
                const section = document.querySelector(item.href);
                // Check if the section exists and if its top position is within the viewport
                if (section && window.scrollY >= section.offsetTop - 150) {
                    currentSection = item.href;
                }
            }
            setActiveSection(currentSection);
        };

        // Add the scroll event listener when the component mounts
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Clean up the event listener when the component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 flex justify-around p-2">
            {navItems.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex flex-col items-center text-xs p-2 rounded-md transition-colors ${
                    // Apply the active color if the section is currently active
                    activeSection === item.href ? 'text-[#2e7d32]' : 'text-[#666]'
                  }`}
                >
                    <span className="text-xl mb-1">{item.icon}</span>
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}