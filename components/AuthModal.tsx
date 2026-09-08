import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset mode when modal opens
  React.useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: name || 'Aspiring Artist',
        email,
        role: 'Actor',
        progress: 15
      });
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-cinematic-charcoal border border-cinematic-goldMuted/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto relative"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cinematic-gold to-transparent opacity-50" />

              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-1">
                      {mode === 'login' ? 'Welcome Back' : 'Start Your Journey'}
                    </h2>
                    <p className="text-cinematic-textBody text-sm">
                      {mode === 'login' ? 'Access your dashboard & training' : 'Create your artist profile'}
                    </p>
                  </div>
                  <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-cinematic-textMuted ml-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-cinematic-black/50 border border-cinematic-goldMuted/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all"
                          placeholder="Jane Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-cinematic-textMuted ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-cinematic-black/50 border border-cinematic-goldMuted/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all"
                        placeholder="artist@dhaari.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-cinematic-textMuted ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-cinematic-black/50 border border-cinematic-goldMuted/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary"
                    className="w-full mt-6" 
                    disabled={isLoading}
                    icon={!isLoading ? <ArrowRight size={18} /> : undefined}
                  >
                    {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-cinematic-textMuted">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-cinematic-gold hover:underline font-medium"
                    >
                      {mode === 'login' ? 'Join Now' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;