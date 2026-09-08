import React from 'react';
import { motion } from 'framer-motion';
import CinematicFloatingIcons from './CinematicFloatingIcons';

const CinematicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-cinematic-black">
      {/* 1. Base Gradient / Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cinematic-charcoal/40 via-cinematic-black to-cinematic-black" />

      {/* 2. Floating Custom SVGs Layer - BLENDED */}
      <CinematicFloatingIcons />

      {/* 3. Projections / Light Beams / Spotlights */}
      {/* Top Left Spotlight - Gold */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-gradient-to-br from-cinematic-gold/10 via-transparent to-transparent blur-[120px] rotate-12 opacity-60" />
      {/* Top Right Spotlight - Red tint for drama */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-to-bl from-cinematic-red/10 via-transparent to-transparent blur-[120px] -rotate-12 opacity-40" />
      {/* Bottom Glow */}
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-cinematic-gold/5 blur-[100px]" />

      {/* 4. Golden "Path" Lines (Dhaari) - SVG Curves */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
        <motion.path
          d="M0,200 C400,0 1200,800 1600,200"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,600 C600,800 1000,0 1600,600"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          strokeDasharray="10 20"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 7, delay: 2, ease: "easeInOut" }}
        />
         <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* 5. Film Grain / Noise Overlay (inline SVG so it works offline / on Vercel) */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};

export default CinematicBackground;