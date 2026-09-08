import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import Button from './ui/Button';

interface HeroSectionProps {
  onJoinClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinClick }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-cinematic-black">
      {/* Background Image - Image 1 */}
      <div className="absolute inset-0 z-0 opacity-[15%] pointer-events-none">
        <img 
          src="/images/1_20260123_112420_0000.svg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Background Video: Cinema Theater */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
           {/* Video Background */}
           <video 
            src="/images/hero-background.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover" 
           />
           {/* Dark overlay to simulate a dark theater environment so the 'projection' pops */}
           <div className="absolute inset-0 bg-black/30" />
           {/* Gradient to blend bottom into the next section */}
           <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black via-transparent to-black/30" />
        </div>
      </motion.div>

      {/* Subtle Projection Beam Effect */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[80vh] bg-gradient-to-b from-white/5 to-transparent blur-[60px] opacity-30 pointer-events-none z-10" />

      {/* Content Positioned to overlay the Movie Screen */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 container mx-auto px-6 text-center h-full flex flex-col items-center justify-center pt-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          {/* Refined Typography - Clean & Professional */}
          <h1 className="flex flex-col items-center justify-center relative">
            {/* Subtle backlight for legibility without heavy glow */}
            <div className="absolute inset-0 bg-black/20 blur-3xl -z-10 rounded-full" />

            <span className="text-lg md:text-2xl  font-sans font-medium tracking-[0.4em] text-gray-300 mb-6 drop-shadow-lg uppercase">
              Enter Into The
            </span>
            
            {/* Main Title on Same Line */}
            <div className="flex flex-row flex-wrap justify-center gap-x-3 md:gap-x-6 items-baseline">
                <span className="text-4xl md:text-6xl lg:text-8xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400 leading-tight tracking-tighter drop-shadow-2xl">
                MOVIE
                </span>
                
                {/* Gradient text for 'INDUSTRY' that feels metallic/projected */}
                <span className="text-4xl md:text-6xl lg:text-8xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400 leading-tight tracking-tighter drop-shadow-2xl">
                INDUSTRY
                </span>
            </div>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
            <Button variant="primary" size="lg" onClick={onJoinClick} icon={<Play size={18} className="fill-current" />}>
              Join Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;