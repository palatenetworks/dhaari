import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-cinematic-black min-h-screen text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-4">Contact</h1>
        <p className="text-sm text-cinematic-textMuted mb-6">We'd love to hear from you. Reach out using the form below or email us at <span className="text-cinematic-gold">info@dhaari.org</span>.</p>

        <div className="mt-6">
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('join-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cinematic-gold text-cinematic-black font-bold"
          >
            Open Application Form
          </button>
        </div>

        <div className="mt-8">
          <a href="/" className="text-cinematic-textMuted hover:text-cinematic-gold">Back to Home</a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
