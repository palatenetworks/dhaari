import React from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, Sparkles } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 relative overflow-hidden bg-cinematic-black">
      {/* Small Image on Right Side Top - Image 2 */}
      <div className="absolute top-0 right-0 w-80 h-80 z-5 pointer-events-none opacity-[20%]">
        <img 
          src="/images/2_20260123_112420_0001.svg"
          alt="About Accent"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Small Image on Right Side Top - Image 3 */}
      <div className="absolute top-20 right-20 w-64 h-64 z-5 pointer-events-none opacity-[15%]">
        <img 
          src="/images/3_20260123_112420_0002.svg"
          alt="About Accent 2"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cinematic-charcoal/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cinematic-black to-transparent"></div>
        {/* Abstract 'Path' Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <path d="M0,100 Q400,300 800,100 T1600,100" fill="none" stroke="#D4AF37" strokeWidth="1" />
          <path d="M0,150 Q450,350 850,150 T1650,150" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-cinematic-goldMuted/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="aspect-[4/5] relative">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1663039904834-2c103e67af86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGZpbG1tYWtpbmd8ZW58MHx8MHx8fDA%3D" 
                  alt="Filmmaking Process" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-8 right-8 bg-cinematic-charcoal/90 backdrop-blur-md p-6 rounded-xl border border-cinematic-gold/30"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cinematic-gold/10 rounded-full text-cinematic-gold">
                    <Clapperboard size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">The Industry Standard</h4>
                    <p className="text-cinematic-textBody text-sm mt-1">
                      Connecting 50+ Production Houses with raw talent across India.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative offset border */}
            <div className="absolute -z-10 top-6 -left-6 w-full h-full border-2 border-cinematic-gold/10 rounded-2xl hidden md:block"></div>
          </motion.div>

          {/* Text Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-cinematic-gold w-5 h-5" />
              <span className="text-cinematic-gold font-bold uppercase tracking-widest text-sm">The Platform</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
              About <span className="text-cinematic-gold">DHAARI</span>
            </h2>
            
            <div className="space-y-6 text-lg text-cinematic-textBody leading-relaxed">
              <p>
                <strong className="text-white">"Dhaari"</strong> (धारी) translates to "Stream" or "Path" — a continuous flow towards a destination. 
              </p>
              <p>
                In the chaotic world of cinema, talent often gets lost without direction. DHAARI is that direction. We are the ecosystem that streamlines the journey from being an outsider to becoming an industry insider.
              </p>
              <p>
                Unlike traditional casting agencies, DHAARI is a <span className="text-white border-b border-cinematic-gold/50">holistic career accelerator</span>. We combine portfolio management, skill development, and direct industry access into a single, premium digital experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-cinematic-gold/30 transition-colors">
                <img src="/images/Dhaari_Logo___2_-removebg-preview.png" alt="" className="h-5 w-auto object-contain shrink-0" />
                <span className="text-white font-medium">Verified Auditions</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-cinematic-gold/30 transition-colors">
                <img src="/images/Dhaari_Logo___2_-removebg-preview.png" alt="" className="h-5 w-auto object-contain shrink-0" />
                <span className="text-white font-medium">Union Card Assistance</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-cinematic-gold/30 transition-colors">
                <img src="/images/Dhaari_Logo___2_-removebg-preview.png" alt="" className="h-5 w-auto object-contain shrink-0" />
                <span className="text-white font-medium">Legal Contracts</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-cinematic-gold/30 transition-colors">
                <img src="/images/Dhaari_Logo___2_-removebg-preview.png" alt="" className="h-5 w-auto object-contain shrink-0" />
                <span className="text-white font-medium">Portfolio Building</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;