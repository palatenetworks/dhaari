import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
  };

  return (
    <footer className="bg-cinematic-black border-t border-cinematic-goldMuted/20 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <img
                src="/images/Dhaari_Logo___2_-removebg-preview.png"
                alt="DHAARI logo"
                className="h-7 w-auto object-contain"
              />
              <span className="text-xl font-display font-bold text-white tracking-widest">DHAARI</span>
            </div>
            <p className="text-cinematic-textMuted max-w-xs">
              Your path to cinema. We build the bridges for the next generation of storytellers.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-cinematic-textMuted hover:text-cinematic-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-cinematic-textMuted hover:text-cinematic-gold transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-cinematic-textMuted hover:text-cinematic-gold transition-colors"><Youtube size={20} /></a>
            <a href="#" className="text-cinematic-textMuted hover:text-cinematic-gold transition-colors"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="border-t border-cinematic-goldMuted/10 pt-8 text-center text-sm text-cinematic-textMuted flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} DHAARI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-cinematic-textBody">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-cinematic-textBody">Terms &amp; Conditions</Link>
            <button onClick={handleContactClick} className="hover:text-cinematic-textBody">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;