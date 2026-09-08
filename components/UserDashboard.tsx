import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Calendar, Award, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { User, Course } from '../types';
import Button from './ui/Button';

interface UserDashboardProps {
  user: User;
}

const courses: Course[] = [
  { id: '1', title: 'Method Acting Fundamentals', instructor: 'Naseeruddin Shah', thumbnail: 'https://images.unsplash.com/photo-1595064650383-7d727a29a210?q=80&w=800&auto=format&fit=crop', progress: 65, duration: '2h 15m' },
  { id: '2', title: 'Voice Modulation Mastery', instructor: 'Pankaj Tripathi', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=800&auto=format&fit=crop', progress: 30, duration: '1h 45m' },
  { id: '3', title: 'Camera Angles for Actors', instructor: 'Sivan Santosh', thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop', progress: 0, duration: '3h 20m' },
];

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  return (
    <div className="pt-24 pb-20 px-6 container mx-auto min-h-screen bg-cinematic-black">
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-cinematic-goldMuted/20 pb-8"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
            Welcome back, <span className="text-cinematic-gold">{user.name}</span>
          </h1>
          <p className="text-cinematic-textBody">Let's continue your journey to the big screen.</p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
           <div className="text-right hidden md:block">
              <p className="text-sm text-cinematic-textMuted uppercase tracking-widest">Current Role</p>
              <p className="text-white font-bold">{user.role}</p>
           </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-cinematic-gold/30 transition-colors bg-cinematic-charcoal"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} className="text-cinematic-gold" />
          </div>
          <p className="text-cinematic-textBody text-sm font-medium mb-1">Overall Progress</p>
          <h3 className="text-4xl font-bold text-white mb-4">{user.progress}%</h3>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-cinematic-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
            />
          </div>
          <p className="text-xs text-cinematic-textMuted mt-2">Level 2: Aspiring Artist</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-cinematic-gold/30 transition-colors bg-cinematic-charcoal"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={64} className="text-purple-400" />
          </div>
          <p className="text-cinematic-textBody text-sm font-medium mb-1">Certificates Earned</p>
          <h3 className="text-4xl font-bold text-white mb-4">2</h3>
          <Button variant="outline" size="sm" className="w-full justify-between text-xs py-2 border-cinematic-goldMuted/50 hover:border-cinematic-gold">
            View Certificates <ChevronRight size={14} />
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-cinematic-gold/30 transition-colors bg-cinematic-charcoal"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={64} className="text-blue-400" />
          </div>
          <p className="text-cinematic-textBody text-sm font-medium mb-1">Next Audition</p>
          <h3 className="text-2xl font-bold text-white mb-2">Oct 24, 2024</h3>
          <p className="text-sm text-cinematic-textMuted mb-4">"City of Dreams" - Supporting Role</p>
          <div className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Confirmed
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Training */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="text-cinematic-gold" size={24} /> Continue Training
            </h2>
            <button className="text-sm text-cinematic-textMuted hover:text-white transition-colors">View All</button>
          </div>

          <div className="space-y-4">
            {courses.map((course, index) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="group flex flex-col sm:flex-row bg-cinematic-charcoal border border-white/5 hover:border-cinematic-gold/30 rounded-xl overflow-hidden transition-all hover:bg-cinematic-card backdrop-blur-sm"
              >
                {/* Advanced Image Blending for Thumbnails */}
                <div className="relative w-full sm:w-48 h-32 shrink-0 overflow-hidden">
                   {/* Gradient overlay to blend image edge into the card content */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent to-cinematic-charcoal/90 sm:bg-gradient-to-r sm:from-transparent sm:to-cinematic-charcoal/90" />
                  
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-10 h-10 bg-cinematic-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-gold/50">
                      <Play size={16} className="fill-cinematic-black text-cinematic-black" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between relative z-20">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cinematic-gold transition-colors">{course.title}</h3>
                    <p className="text-sm text-cinematic-textBody">Instructor: {course.instructor}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-cinematic-textMuted mb-1">
                      <span>{course.progress}% Complete</span>
                      {course.progress > 0 && <span className="text-cinematic-gold">Resume</span>}
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cinematic-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Mentorship & Notices */}
        <div className="space-y-8">
           <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <Star className="text-cinematic-gold" size={24} /> Mentorship
            </h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-cinematic-gold/10 to-cinematic-charcoal border border-cinematic-gold/20 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" className="w-14 h-14 rounded-full border-2 border-cinematic-gold object-cover" alt="Mentor" />
                <div>
                  <h4 className="text-white font-bold">Raghav Juyal</h4>
                  <p className="text-xs text-cinematic-gold uppercase">Dance Mentor</p>
                </div>
              </div>
              <p className="text-cinematic-textBody text-sm mb-6 leading-relaxed">
                "Your last submission showed great energy, but focus on your fluidity in the second verse."
              </p>
              <Button size="sm" className="w-full" variant="outline">
                Schedule Session
              </Button>
            </motion.div>
           </div>

           <div className="p-6 bg-cinematic-card border border-white/5 rounded-xl">
              <h3 className="text-cinematic-goldLight font-bold mb-2 text-sm uppercase tracking-wide">Industry Notice</h3>
              <p className="text-cinematic-textMuted text-sm">New casting calls for historical dramas are opening next week. Ensure your portfolio is up to date.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;