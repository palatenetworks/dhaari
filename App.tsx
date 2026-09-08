import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/privacy-policy';
import TermsAndConditions from './components/terms-and-conditions';
import ContactPage from './components/contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/terms-of-service" element={<TermsAndConditions />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;