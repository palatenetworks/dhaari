import React from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, PenTool, Video, Music, Scissors, Palette, Move, Mic2 } from 'lucide-react';
import { Role } from '../types';

// Updated icon set for better variety
const roles: Role[] = [
  { id: '1', title: 'Actor', icon: Clapperboard, description: 'Lead, Supporting, Extras' },
  { id: '2', title: 'Director', icon: Video, description: 'Feature, Short, Ad Films' },
  { id: '3', title: 'Writer', icon: PenTool, description: 'Screenplay, Dialogues' },
  { id: '4', title: 'Cinematographer', icon: Video, description: 'DOP, Camera Operators' },
  { id: '5', title: 'Musician', icon: Music, description: 'Composers, Singers' },
  { id: '6', title: 'Editor', icon: Scissors, description: 'Post-Production, VFX' },
  { id: '7', title: 'Designer', icon: Palette, description: 'Costume, Set, Art' },
  { id: '8', title: 'Dancer', icon: Move, description: 'Choreography, Performance' },
];

interface JoinCardsGridProps {
  onRoleSelect?: (role: string) => void;
}

const JoinCardsGrid: React.FC<JoinCardsGridProps> = ({ onRoleSelect }) => {
  return (
    <section id="roles" className="py-24 relative bg-cinematic-charcoal/50 backdrop-blur-sm border-y border-white/5 overflow-hidden">
      {/* Small Image on Top Right - Image 3 */}
      <div className="absolute top-0 right-0 w-full h-96 z-5 pointer-events-none opacity-[25%]">
        <img 
          src="/images/3_20260123_112420_0002.svg"
          alt="Roles Accent"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Who Can Join?</h2>
          <p className="text-cinematic-textBody">Select your craft to begin your application.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              onClick={() => onRoleSelect && onRoleSelect(role.title)}
              className="glass-panel group relative p-8 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden hover:border-cinematic-gold/60 bg-cinematic-black/40 backdrop-blur-md hover:bg-cinematic-charcoal/80"
            >
              {/* Hover Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cinematic-gold/0 to-cinematic-gold/0 group-hover:from-cinematic-gold/10 group-hover:to-transparent transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-cinematic-gold group-hover:text-cinematic-black transition-colors duration-300 shadow-lg shadow-black/20 group-hover:shadow-cinematic-gold/30">
                  <role.icon size={32} className="text-cinematic-gold group-hover:text-cinematic-black transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-sm text-cinematic-textMuted group-hover:text-cinematic-textBody transition-colors">{role.description}</p>
                
                <motion.div 
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "auto" }}
                >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onRoleSelect && onRoleSelect(role.title); }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cinematic-gold text-cinematic-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition"
                    >
                      Apply Now
                    </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoinCardsGrid;