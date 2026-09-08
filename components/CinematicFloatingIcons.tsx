import React from 'react';
import { motion } from 'framer-motion';

// CONFIGURATION:
// Paste your 10 SVG contents into the 'path' properties below.
// You can adjust 'size', 'top/left' positions, and 'opacity' for each.

const icons = [
  {
    id: 1,
    name: "Icon 1",
    // Example: Top Left Corner
    className: "top-[5%] left-[5%]",
    size: 120,
    animationDuration: 15,
    content: (
      <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 2,
    name: "Icon 2",
    className: "top-[15%] right-[10%]",
    size: 100,
    animationDuration: 18,
    content: (
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
    )
  },
  {
    id: 3,
    name: "Icon 3",
    className: "top-[35%] left-[15%]",
    size: 140,
    animationDuration: 20,
    content: (
      <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 4,
    name: "Icon 4",
    className: "top-[45%] right-[20%]",
    size: 90,
    animationDuration: 22,
    content: (
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 24l-6.3 -2.8 1.7-7L2 9.5l7.1-.6z" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 5,
    name: "Icon 5",
    className: "bottom-[30%] left-[8%]",
    size: 160,
    animationDuration: 25,
    content: (
      <path d="M4 4h16v16H4zM4 9h16M4 15h16M9 4v16M15 4v16" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 6,
    name: "Icon 6",
    className: "bottom-[15%] right-[5%]",
    size: 110,
    animationDuration: 17,
    content: (
      <path d="M12 2l10 10-10 10L2 12z" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 7,
    name: "Icon 7",
    className: "top-[60%] left-[45%] opacity-5", // Very subtle center one
    size: 300,
    animationDuration: 30,
    content: (
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.5" fill="none" />
    )
  },
  {
    id: 8,
    name: "Icon 8",
    className: "top-[10%] left-[40%]",
    size: 80,
    animationDuration: 14,
    content: (
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 9,
    name: "Icon 9",
    className: "bottom-[5%] left-[30%]",
    size: 130,
    animationDuration: 19,
    content: (
      <path d="M12 3a9 9 0 100 18 7 7 0 010-18z" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  },
  {
    id: 10,
    name: "Icon 10",
    className: "top-[80%] right-[35%]",
    size: 150,
    animationDuration: 21,
    content: (
      <path d="M2 12c3-7 17-7 20 0M2 17c3-7 17-7 20 0" stroke="currentColor" strokeWidth="1" fill="none" />
    )
  }
];

const CinematicFloatingIcons: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className={`absolute text-cinematic-gold/10 mix-blend-overlay ${icon.className}`}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{ 
            y: [0, -20, 0], 
            rotate: [0, 5, -5, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: icon.animationDuration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            filter: 'blur(1px)', // Slight blur for depth of field
          }}
        >
          <svg
            width={icon.size}
            height={icon.size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {icon.content}
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default CinematicFloatingIcons;