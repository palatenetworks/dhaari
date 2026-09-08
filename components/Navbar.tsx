import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';

interface NavbarProps {
  onJoinClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Roles', href: '#roles' },
    { name: 'Workshops', href: '#workshops' },
    { name: 'Process', href: '#process' },
    { name: 'Gallery', href: '#gallery' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-cinematic-black/95 backdrop-blur-md border-b border-cinematic-goldMuted/30 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo - Royal Gold */}
        <a href="#" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/images/Dhaari_Logo___2_-removebg-preview.png"
              alt="DHAARI logo"
              className="h-9 w-auto object-contain"
            />
          </motion.div>
          <span className="text-2xl font-display font-bold tracking-widest text-white">
            DHAARI
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-cinematic-textBody hover:text-cinematic-gold transition-colors text-sm font-medium tracking-wide"
            >
              {link.name}
            </a>
          ))}
          
          <Button variant="primary" size="sm" onClick={onJoinClick}>
              Join Now
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white hover:text-cinematic-gold transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-cinematic-charcoal border-b border-cinematic-goldMuted/30 p-6 shadow-2xl"
          >
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-white text-lg font-medium hover:text-cinematic-gold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              
              <Button onClick={() => {
                  setIsMobileMenuOpen(false);
                  onJoinClick();
              }} className="w-full">
                  Join Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;