import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'>, MotionProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full tracking-wide";
  
  const variants = {
    // Crimson Red CTA as requested
    primary: "bg-cinematic-red text-white shadow-[0_0_20px_rgba(198,40,40,0.4)] hover:bg-cinematic-redDeep hover:shadow-[0_0_25px_rgba(198,40,40,0.6)] border border-transparent",
    // Royal Gold Accent
    secondary: "bg-cinematic-gold text-cinematic-black hover:bg-cinematic-goldHighlight hover:text-cinematic-black",
    // Gold Outline
    outline: "border border-cinematic-goldMuted text-cinematic-gold hover:border-cinematic-gold hover:bg-cinematic-gold/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </motion.button>
  );
};

export default Button;