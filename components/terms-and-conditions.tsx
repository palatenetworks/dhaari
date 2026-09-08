import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-4">Terms &amp; Conditions</h1>
      <p className="text-sm text-cinematic-textMuted mb-8">Last updated: February 2, 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        <p className="text-cinematic-textMuted">
          Thanks for visiting DHAARI. These Terms explain how our site works and what we expect from people who use it. We tried to keep this short and clear — please read it and reach out if anything is unclear.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Using DHAARI</h2>
        <p className="text-cinematic-textMuted">
          Use the site for legal, constructive purposes. Don’t do anything that harms the site, other users, or the experience we try to create here.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Content</h2>
        <p className="text-cinematic-textMuted">
          If you post something on DHAARI — ideas, projects, or comments — you keep ownership of that content. By sharing it with us, you give DHAARI permission to use it to run and promote the service (for example, showing it on the site or in our marketing).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Content &amp; Intellectual Property</h2>
        <p className="text-cinematic-textMuted">
          The look and content of this site — branding, images, and original writing — belong to DHAARI or our partners. Please don’t reuse our material without permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Accounts &amp; Safety</h2>
        <p className="text-cinematic-textMuted">
          If you sign up for an account, keep your password safe and don’t share it. We may suspend or remove accounts that break these Terms or that create safety concerns.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payments, Cancellations &amp; Refunds</h2>
        <p className="text-cinematic-textMuted">
          When payments are involved, we’ll be clear about fees, refunds, and delivery. We work with secure payment partners and follow applicable rules for transactions.
        </p>
        <p className="text-cinematic-textMuted mt-2">
          Payment cancellations: If you need to cancel a paid service or booking, request cancellation within 24 hours of the transaction for a full refund provided the service has not yet started. Cancellations requested after 24 hours or after services have begun are evaluated on a case-by-case basis and may be subject to deductions for services already rendered and transaction fees. Time-limited workshops or events may have separate cancellation windows noted on the event page at time of purchase.
        </p>
        <p className="text-cinematic-textMuted mt-2">
          Disputes or chargebacks: If you dispute a charge, our payments partners may investigate; we will cooperate fully. To request a refund or discuss a cancellation, please <Link to="/contact" className="underline hover:text-cinematic-gold">Contact</Link> us with your transaction details and we will respond promptly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">A Quick Note on Warranties</h2>
        <p className="text-cinematic-textMuted">
          We strive to keep the site working well, but we can’t promise it will be perfect or fit every purpose. Use the site at your own risk.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
        <p className="text-cinematic-textMuted">
          To the extent the law allows, DHAARI is not responsible for indirect or unforeseeable losses. Our liability for direct losses will be limited as permitted by law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Changes to These Terms</h2>
        <p className="text-cinematic-textMuted">
          We may update these Terms now and then. If we make important changes, we’ll try to highlight them. Continued use after changes means you accept the updated Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Questions?</h2>
        <p className="text-cinematic-textMuted">
          If anything here isn’t clear, or if you need help, please <Link to="/contact" className="underline hover:text-cinematic-gold">Contact</Link> us — we’re happy to help.
        </p>
      </section>

      <div className="flex gap-4">
        <Link to="/" className="text-cinematic-textMuted hover:text-cinematic-gold">Home</Link>
        <Link to="/privacy-policy" className="text-cinematic-textMuted hover:text-cinematic-gold">Privacy Policy</Link>
      </div>
    </main>
  );
};

export default TermsAndConditions;
