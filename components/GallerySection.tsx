import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
    title: "On Location",
    category: "Production"
  },
  {
    src: "data:image/jpeg;base64,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",
    title: "Camera Rolling",
    category: "Cinematography"
  },
  {
    src: "data:image/jpeg;base64,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",
    title: "Character Prep",
    category: "Acting"
  },
  {
    src: "data:image/jpeg;base64,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",
    title: "The Script",
    category: "Production"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1691223714387-a74006933ffb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fHNldCUyMGxpZ2h0aW5nfGVufDB8fDB8fHww",
    title: "Set Lighting",
    category: "Cinematography"
  },
  {
    src: "https://images.unsplash.com/photo-1744686909710-37b9531cbb60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9zdCUyMHByb2R1Y3Rpb258ZW58MHx8MHx8fDA%3D",
    title: "Post Production",
    category: "Editing"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1763994854436-f8e2e127701c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Green Screen VFX",
    category: "Production"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1674273913909-8648c0ba1c6b?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Costume Design",
    category: "Production"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1709371824574-e581a1379f03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGRpcmVjdG9yJ3MlMjBjaGFpcnxlbnwwfHwwfHx8MA%3D%3D",
    title: "Director's Monitor",
    category: "Cinematography"
  }
];

const GallerySection: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const categories = ["All", "Production", "Cinematography", "Acting", "Editing"];

  const filteredImages = filter === "All" ? images : images.filter(img => img.category === filter);

  const openLightbox = (img: typeof images[0]) => {
    // Find index in original array to handle navigation correctly
    const index = images.indexOf(img);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => setSelectedImageIndex(null);

  const navigateLightbox = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  return (
    <section id="gallery" className="py-24 relative bg-cinematic-black">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">Life at <span className="text-cinematic-gold">DHAARI</span></h2>
            <p className="text-cinematic-textBody">Behind the scenes of our latest productions and workshops.</p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-2 text-cinematic-gold hover:text-white transition-colors uppercase text-sm tracking-widest font-bold mt-4 md:mt-0"
          >
            <Camera size={18} /> View All Archives
          </motion.button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all border ${
                filter === cat 
                ? 'bg-white/10 text-cinematic-gold border-cinematic-gold/50' 
                : 'bg-transparent text-cinematic-textMuted border-transparent hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.src} // Use src as key since we don't have ids
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => openLightbox(img)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-cinematic-charcoal border border-white/5 cursor-pointer"
              >
                {/* Image */}
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-cinematic-gold text-xs font-bold uppercase tracking-wider mb-1 block">{img.category}</span>
                  <h3 className="text-white text-xl font-display font-bold">{img.title}</h3>
                </div>

                {/* Hover Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-cinematic-gold/20 backdrop-blur-md rounded-full flex items-center justify-center text-cinematic-gold opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
                  <Maximize2 size={16} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>

            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-cinematic-gold transition-colors p-2 hidden md:block"
              onClick={(e) => navigateLightbox('prev', e)}
            >
              <ChevronLeft size={48} />
            </button>

            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-cinematic-gold transition-colors p-2 hidden md:block"
              onClick={(e) => navigateLightbox('next', e)}
            >
              <ChevronRight size={48} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[selectedImageIndex].src} 
                alt={images[selectedImageIndex].title} 
                className="w-full h-full object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <div className="absolute bottom-[-60px] left-0 text-left">
                <h3 className="text-2xl font-display font-bold text-white">{images[selectedImageIndex].title}</h3>
                <p className="text-cinematic-gold text-sm uppercase tracking-widest">{images[selectedImageIndex].category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;