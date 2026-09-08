import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  { 
    id: '1', 
    name: 'Aara Sharma', 
    role: 'Lead Actor, "The Last Dawn"', 
    quote: 'DHAARI gave me the exposure I needed. Within 3 months of training, I landed my first feature film role.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: '2', 
    name: 'Vikram Singh', 
    role: 'Director, Short Film Awardee', 
    quote: 'The mentorship program here connects you with legends. It’s not just a course, it’s an induction into the industry.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: '3', 
    name: 'Elena Rodriguez', 
    role: 'Sound Designer', 
    quote: 'Finally, a platform that respects technicians as much as the stars. DHAARI is a game changer.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="stories" className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent to-cinematic-black/80">
      {/* Background Image - Image 5 */}
      <div className="absolute inset-0 opacity-[15%] z-0 pointer-events-none">
        <img 
          src="/images/5_20260123_112420_0004.svg"
          alt="Stories Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Success Stories</h2>
          <div className="w-24 h-1 bg-cinematic-gold mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-cinematic-black/50 backdrop-blur-md p-8 rounded-2xl border border-cinematic-goldMuted/20 relative hover:border-cinematic-gold/40 transition-colors shadow-lg"
            >
              <Quote className="absolute top-8 right-8 text-cinematic-gold/20 w-12 h-12" />
              
              <p className="text-cinematic-textBody italic mb-8 relative z-10 leading-relaxed">"{t.quote}"</p>
              
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-cinematic-gold" />
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-cinematic-gold text-xs uppercase tracking-wide">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;