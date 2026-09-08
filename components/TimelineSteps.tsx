import React from 'react';
import { motion } from 'framer-motion';
import { TimelineStep } from '../types';

const steps: TimelineStep[] = [
  { number: '01', title: 'Register Profile', description: 'Create your professional artist portfolio with photos and showreels.' },
  { number: '02', title: 'Training & Mentorship', description: 'Get groomed by industry veterans through workshops and masterclasses.' },
  { number: '03', title: 'Auditions & Projects', description: 'Access exclusive casting calls and project opportunities curated for you.' },
  { number: '04', title: 'Enter the Industry', description: 'Land your first gig and begin your professional journey in cinema.' },
];

const TimelineSteps: React.FC = () => {
  return (
    <section id="process" className="py-32 relative overflow-hidden bg-transparent">
      {/* Background Image - Image 4 */}
      <div className="absolute inset-0 opacity-[15%] z-0 pointer-events-none">
        <img 
          src="/images/4_20260123_112420_0003.svg"
          alt="Process Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Film Strip Background Pattern (Vertical Center) - Made subtle */}
      <div className="absolute left-1/2 top-0 bottom-0 w-24 -translate-x-1/2 hidden md:flex flex-col items-center opacity-5 pointer-events-none">
         <div className="w-full h-full border-x-4 border-dashed border-white/5 bg-black/20 flex flex-col items-center justify-center gap-4">
            <div className="absolute inset-y-0 left-2 w-1 bg-white/5"></div>
            <div className="absolute inset-y-0 right-2 w-1 bg-white/5"></div>
         </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">How DHAARI Works</h2>
          <p className="text-cinematic-textBody">Your roadmap from dreamer to achiever.</p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          
          <div className="flex flex-col gap-12 md:gap-24">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Content Side */}
                <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'justify-end md:text-right' : 'justify-start md:text-left'} text-center`}>
                  <div className={`max-w-md px-6 py-8 rounded-2xl bg-cinematic-charcoal/40 backdrop-blur-md border border-white/5 ${index % 2 === 0 ? 'md:pr-16 md:mr-[-40px] z-0' : 'md:pl-16 md:ml-[-40px] z-0'}`}>
                    <span className="text-cinematic-gold text-sm font-bold tracking-widest uppercase mb-2 block">Step {step.number}</span>
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-cinematic-textBody leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Center Node */}
                <div className="relative flex items-center justify-center w-16 h-16 shrink-0 z-20">
                    <div className="w-16 h-16 rounded-full bg-cinematic-charcoal border-2 border-cinematic-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black">
                            <span className="text-cinematic-gold font-bold">{step.number}</span>
                        </div>
                    </div>
                </div>

                {/* Empty Side for balance */}
                <div className="w-full md:w-1/2 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSteps;