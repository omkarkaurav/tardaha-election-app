// src/app/components/VillageMotif.jsx

import { FaTree, FaHome, FaTractor, FaWater, FaSun } from 'react-icons/fa';

export default function VillageMotif() {
  const icons = [
    { component: <FaTree />, delay: '0s' },
    { component: <FaHome />, delay: '0.5s' },
    { component: <FaTractor />, delay: '1s' },
    { component: <FaWater />, delay: '1.5s' },
    { component: <FaSun />, delay: '2s' },
  ];

  return (
    <div className="py-10 bg-white">
      <div className="flex justify-center gap-4 md:gap-12 text-4xl md:text-5xl text-[#4caf50] opacity-70">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="gentle-sway-animation"
            style={{ animationDelay: icon.delay }}
          >
            {icon.component}
          </div>
        ))}
      </div>
    </div>
  );
}