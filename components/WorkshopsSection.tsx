import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const workshops = [
  {
    id: 1,
    title: "Method Acting Masterclass",
    description: "Dive deep into the Stanislavski system and emotional memory techniques with a living legend.",
    image: "https://media.istockphoto.com/id/1348130668/photo/acting-students-doing-an-improv-exercise-in-a-drama-class.webp?a=1&b=1&s=612x612&w=0&k=20&c=pL-I5McfnJsrBYHQLisInZDlaj0T9bL8lHpIc0Mpyn8=",
    tags: ["Acting", "Advanced"],
    category: "Acting"
  },
  {
    id: 2,
    title: "Screenwriting Intensive",
    description: "Learn to craft compelling narratives, dialogue, and screenplay structures for modern cinema.",
    image: "https://media.istockphoto.com/id/578292146/photo/clapperboard-with-sketchbook-for-writing-storyboard.webp?a=1&b=1&s=612x612&w=0&k=20&c=6HMO-19EvcWYR3hU8VGHhCSqhlSX0jFI6aAzTMJXoSg=",
    tags: ["Writing", "Beginner"],
    category: "Writing"
  },
  {
    id: 3,
    title: "Cinematic Lighting",
    description: "Hands-on workshop covering lighting setups, shadow play, and mood creation.",
    image: "https://plus.unsplash.com/premium_photo-1748152778995-6c3c44290750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q2luZW1hdGljJTIwTGlnaHRpbmd8ZW58MHx8MHx8fDA%3D",
    tags: ["Technical", "Hands-on"],
    category: "Technical"
  },
  {
    id: 4,
    title: "Voice Modulation",
    description: "Master the art of voice control, diction, and emotional expression through sound.",
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXVkaW98ZW58MHx8MHx8fDA%3D",
    tags: ["Acting", "Intermediate"],
    category: "Acting"
  },
  {
    id: 5,
    title: "Action & Stunt Choreography",
    description: "Safety protocols, combat rhythm, and selling the hit for camera.",
    image: "https://images.unsplash.com/flagged/photo-1568579093543-4c1c25adeea0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWN0aW5nJTIwYW5kJTIwc3R1bnRzfGVufDB8fDB8fHww",
    tags: ["Stunts", "Physical"],
    category: "Acting"
  },
  {
    id: 6,
    title: "Film Editing Essentials",
    description: "The invisible art of storytelling using industry standard software and pacing techniques.",
    image: "https://plus.unsplash.com/premium_photo-1663040316559-8684ca45d7e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmlsbSUyMGVkaXRpbmd8ZW58MHx8MHx8fDA%3D",
    tags: ["Post-Production", "Software"],
    category: "Technical"
  }
];

const WorkshopsSection: React.FC = () => {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Acting", "Writing", "Technical"];

  const filteredWorkshops = filter === "All" 
    ? workshops 
    : workshops.filter(w => w.category === filter);

  return (
    <section id="workshops" className="py-24 relative bg-cinematic-charcoal/30">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cinematic-gold/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinematic-gold/10 border border-cinematic-gold/20 text-cinematic-gold text-xs font-bold uppercase tracking-widest mb-4"
          >
             <Star size={12} fill="currentColor" /> Learn & Grow
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Exclusive <span className="text-cinematic-gold">Workshops</span>
          </motion.h2>
          <p className="text-cinematic-textBody max-w-2xl mx-auto mb-8">
            Learn directly from the masters of the craft.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                  filter === category 
                  ? 'bg-cinematic-gold text-cinematic-black border-cinematic-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-transparent text-cinematic-textMuted border-white/10 hover:border-cinematic-gold/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredWorkshops.map((workshop) => (
              <motion.div
                layout
                key={workshop.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-cinematic-black border border-white/10 rounded-2xl overflow-hidden hover:border-cinematic-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={workshop.image} 
                    alt={workshop.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {workshop.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                     <h3 className="text-xl font-bold text-white group-hover:text-cinematic-gold transition-colors line-clamp-2">{workshop.title}</h3>
                  </div>
                  
                  <p className="text-sm text-cinematic-textBody mb-4 line-clamp-3 leading-relaxed">
                    {workshop.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkshopsSection;