import React, { useState } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import AboutUsSection from './AboutUsSection';
import WorkshopsSection from './WorkshopsSection';
import GallerySection from './GallerySection';
import JoinCardsGrid from './JoinCardsGrid';
import TimelineSteps from './TimelineSteps';
import ContactSection from './ContactSection';
import Footer from './Footer';
import CinematicBackground from './CinematicBackground';
import TalentFormModal from './TalentFormModal';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const scrollToJoin = () => {
    const section = document.getElementById('join-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRoleSelect = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    const section = document.getElementById('join-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-cinematic-black text-white min-h-screen selection:bg-cinematic-gold selection:text-cinematic-black font-sans relative">
      {/* 1. Fixed Cinematic Background Layer */}
      <CinematicBackground />

      {/* 2. Content Layer */}
      <div className="relative z-10">
        <Navbar 
          onJoinClick={scrollToJoin} 
        />
        
        <main className="flex flex-col gap-0">
          <HeroSection onJoinClick={scrollToJoin} />
          
          {/* Vision & Team (About Us) */}
          <AboutUsSection />
          
          {/* Roles & Opportunities */}
          <JoinCardsGrid onRoleSelect={handleRoleSelect} />
          
          {/* Process Timeline */}
          <TimelineSteps />

          {/* Workshops */}
          <WorkshopsSection />
          
          {/* Life at Dhaari (Gallery) */}
          <GallerySection />

          {/* About Dhaari (Platform Info) - Moved here as requested */}
          <AboutSection />
          
          
          {/* Application Form */}
          <ContactSection initialRole={selectedRole} />
        </main>

        <Footer />

        {/* Dynamic Modal for Quick Apply from Roles */}
        <TalentFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialRole={selectedRole}
        />
      </div>
    </div>
  );
};

export default LandingPage;