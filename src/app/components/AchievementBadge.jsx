'use client';
import { FaTrophy } from 'react-icons/fa';

export default function AchievementBadge({ title, message }) {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#ff9800] to-[#ff5722] text-white p-8 rounded-2xl text-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-[10001] badge-popup-animation">
      <FaTrophy className="text-6xl mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-lg">{message}</p>
    </div>
  );
}