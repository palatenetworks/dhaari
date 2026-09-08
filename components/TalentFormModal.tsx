import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CreditCard, ArrowRight, Upload, Star } from 'lucide-react';
import Button from './ui/Button';

interface TalentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: string;
}

const TalentFormModal: React.FC<TalentFormModalProps> = ({ isOpen, onClose, initialRole }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole || '');

  useEffect(() => {
    if (initialRole) setSelectedRole(initialRole);
  }, [initialRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  const roles = [
    "Actor", "Director", "Writer", "Cinematographer",
    "Musician", "Editor", "Dancer", "Other"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-2xl bg-cinematic-charcoal border border-cinematic-goldMuted/30 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-cinematic-goldMuted/20 flex justify-between items-center bg-cinematic-black/60">
                <h3 className="text-xl font-bold text-white">Cast Your Role</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6 bg-gradient-to-b from-cinematic-charcoal to-cinematic-black">
                {isSubmitted ? (
                  <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-2xl text-white font-bold mb-2">
                      Application Submitted
                    </h4>
                    <p className="text-cinematic-textMuted">
                      Your profile for <span className="text-cinematic-gold">{selectedRole}</span> is under review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Personal Info */}
                    <section>
                      <h4 className="text-sm font-bold text-white mb-4">PERSONAL INFORMATION</h4>
                      <div className="grid md:grid-cols-2 gap-5">
                        <InputGroup label="First Name" required />
                        <InputGroup label="Last Name" required />
                        <InputGroup label="Email" type="email" required />
                        <InputGroup label="Phone Number" required />
                      </div>
                    </section>

                    {/* Professional Info */}
                    <section>
                      <h4 className="text-sm font-bold text-white mb-4">PROFESSIONAL DETAILS</h4>

                      <select
                        className="w-full mb-4 bg-cinematic-black border border-cinematic-goldMuted/20 rounded-lg px-4 py-3 text-white"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Role</option>
                        {roles.map(role => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>

                      <textarea
                        className="w-full bg-cinematic-black border border-cinematic-goldMuted/20 rounded-lg px-4 py-3 text-white min-h-[100px]"
                        placeholder="Tell us about yourself"
                      />
                    </section>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      variant="primary"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const InputGroup = ({ label, type = "text", required = false }: any) => (
  <div>
    <label className="text-xs text-cinematic-textMuted">{label}</label>
    <input
      type={type}
      required={required}
      className="w-full bg-cinematic-black border border-cinematic-goldMuted/20 rounded-lg px-4 py-3 text-white"
    />
  </div>
);

export default TalentFormModal;