'use client';

import { useState, useEffect } from 'react';
import { FaFlag } from 'react-icons/fa';
import Link from 'next/link';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#home', label: 'होम' },
        { href: '#about', label: 'परिचय' },
        { href: '#promises', label: 'वादे' },
        { href: '#support', label: 'समर्थन' },
        { href: '#contact', label: 'संपर्क' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-white/80'}`}>
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="#home" className="flex items-center gap-2 text-[#2e7d32] font-bold text-lg">
                    <FaFlag className="text-xl" />
                    <span>तरदहा पंचायत</span>
                </Link>

                {/* Links are hidden on mobile (hidden) and shown on md+ screens (md:flex) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="font-semibold text-[#333] hover:text-[#2e7d32] transition-colors relative group">
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2e7d32] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
