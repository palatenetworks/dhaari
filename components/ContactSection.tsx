import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Lock, ArrowRight, Sparkles, Star, Ticket, Smartphone, Mail, User, X, ShieldCheck, QrCode, AlertCircle, Loader2 } from 'lucide-react';
import Button from './ui/Button';

// Razorpay type definition for window
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ContactSectionProps {
  initialRole?: string;
}

// Payment lifecycle:
//   idle -> creating -> awaiting_payment -> verifying -> done
// any step can drop to `error` (with a recoverable message).
type PaymentPhase = 'idle' | 'creating' | 'awaiting_payment' | 'verifying' | 'done' | 'error';

interface PaymentError {
  message: string;
  paymentId?: string;
  retryVerify?: boolean;
}

const REQUEST_TIMEOUT_MS = 20000;

async function postJson(
  url: string,
  body: unknown,
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<{ ok: boolean; status: number; data: any }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

const ContactSection: React.FC<ContactSectionProps> = ({ initialRole }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<PaymentPhase>('idle');
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);

  // Guards the async payment flow: once Razorpay's success handler fires we must
  // ignore the modal's `ondismiss`, and we keep the last confirmation payload so
  // "Retry confirmation" works without charging the user again.
  const settledRef = useRef(false);
  const pendingVerifyRef = useRef<{ payload: any; response: any } | null>(null);

  const isSubmitted = phase === 'done';
  const isBusy = phase === 'creating' || phase === 'awaiting_payment' || phase === 'verifying';

  // Simple form state
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      role: initialRole || '',
      roleOther: ''
  });

  // Sync initialRole when provided (e.g., when user clicks Apply Now)
  React.useEffect(() => {
    if (!initialRole) return;
    const availableRoles = ['Actor','Director','Writer','Cinematographer','Musician','Editor','Designer','Dancer'];
    if (availableRoles.includes(initialRole)) {
      setFormData(f => ({ ...f, role: initialRole, roleOther: '' }));
    } else {
      setFormData(f => ({ ...f, role: 'Other', roleOther: initialRole }));
    }
    const section = document.getElementById('join-section');
    if (section) {
      setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [initialRole]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
      setFormData({ ...formData, [name]: value });
      if (formErrors[name]) {
          setFormErrors({ ...formErrors, [name]: '' });
      }
  };

  const validateForm = () => {
      const errors: Record<string, string> = {};
      if (!formData.firstName.trim()) errors.firstName = 'First Name is required';
      if (!formData.lastName.trim()) errors.lastName = 'Last Name is required';
      if (!formData.phone.trim()) errors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = 'Invalid phone number';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
      if (!formData.role.trim()) errors.role = 'Please select a role';
      if (formData.role === 'Other' && !formData.roleOther.trim()) errors.roleOther = 'Please specify your role';
      if (!formData.address.trim()) errors.address = 'Address is required';
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    // A payment was already made but not yet confirmed — never charge again;
    // the correct action is to retry the confirmation call.
    if (pendingVerifyRef.current) {
        retryVerification();
        return;
    }
    if (validateForm()) {
        void startPayment();
    }
  };

  const applicationPayload = () => ({
      firstname: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      contact_no: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      role: formData.role,
      other_description: formData.role === 'Other' ? formData.roleOther.trim() : ''
  });

  const resetForm = () => {
      setFormData({ firstName: '', lastName: '', phone: '', email: '', address: '', role: '', roleOther: '' });
      setFormErrors({});
  };

  const failPayment = (message: string, extra?: Partial<PaymentError>) => {
      setPhase('error');
      setPaymentError({ message, ...extra });
  };

  // Step 1: ask the server to create a Razorpay order, then open checkout.
  const startPayment = async () => {
    setPaymentError(null);
    setFormErrors({});
    settledRef.current = false;
    pendingVerifyRef.current = null;
    setPhase('creating');

    const payload = applicationPayload();

    let order: any;
    try {
        const { ok, status, data } = await postJson('/api/create-order', payload);
        if (!ok || !data?.orderId) {
            failPayment(
                data?.error ||
                (status >= 500
                    ? 'Our payment service is temporarily unavailable. Please try again shortly.'
                    : 'Could not start the payment. Please check your details and try again.')
            );
            return;
        }
        order = data;
    } catch (err: any) {
        failPayment(
            err?.name === 'AbortError'
                ? 'The request timed out. Check your internet connection and try again.'
                : 'Network error while starting payment. Please try again.'
        );
        return;
    }

    const Razorpay = (window as any).Razorpay;
    if (typeof Razorpay !== 'function') {
        failPayment('The payment window could not load. Disable any ad/script blockers for this site, then retry.');
        return;
    }

    setPhase('awaiting_payment');

    let rzp: any;
    try {
        rzp = new Razorpay({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            order_id: order.orderId,
            name: 'DHAARI',
            description: 'Lifetime Membership — 500 INR',
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                contact: formData.phone,
            },
            notes: { role: payload.role },
            theme: { color: '#D4AF37' },
            retry: { enabled: false },
            modal: {
                ondismiss: () => {
                    // Only meaningful if the user closed checkout *without* paying.
                    if (settledRef.current) return;
                    setPhase('idle');
                    setPaymentError({
                        message: 'Payment was cancelled before it completed — you have not been charged.',
                    });
                },
            },
            handler: (response: any) => {
                settledRef.current = true;
                void verifyPayment(payload, response);
            },
        });

        rzp.on('payment.failed', (resp: any) => {
            if (settledRef.current) return;
            settledRef.current = true;
            const e = resp?.error || {};
            failPayment(
                e.description ||
                    'The payment did not go through. If any amount was deducted it is auto-refunded within 5–7 days.',
                { paymentId: e?.metadata?.payment_id }
            );
        });

        rzp.open();
    } catch (err: any) {
        failPayment('Could not open the payment window. Please retry.');
    }
  };

  // Step 2: hand the signed response to the server for verification. The server
  // checks the signature + payment status, then emails the application.
  const verifyPayment = async (payload: any, response: any) => {
    pendingVerifyRef.current = { payload, response };
    setPhase('verifying');
    setPaymentError(null);

    const body = {
        ...payload,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
    };

    try {
        const { ok, data } = await postJson('/api/verify-payment', body);

        if (ok && data?.success) {
            pendingVerifyRef.current = null;
            setPaymentError(null);
            setPhase('done');
            if (data.emailed === false) {
                console.warn('[payment] verified, but the notification email did not send. Payment is on record with DHAARI.');
            }
            window.setTimeout(() => {
                setPhase('idle');
                resetForm();
            }, 6000);
            return;
        }

        // Server reached, but it rejected the confirmation. Retrying the same
        // call will not help (bad signature / payment not completed), so clear
        // the pending state and let the user start a fresh attempt.
        pendingVerifyRef.current = null;
        failPayment(
            data?.error || 'We could not confirm your payment. Please contact us with the payment ID below.',
            { paymentId: response.razorpay_payment_id, retryVerify: false }
        );
    } catch (err: any) {
        // The payment almost certainly succeeded — we just could not reach our
        // server to confirm. Offer a retry that does NOT re-charge.
        failPayment(
            'Your payment went through, but we could not confirm it just now. Tap "Retry confirmation" — you will not be charged again.',
            { paymentId: response.razorpay_payment_id, retryVerify: true }
        );
    }
  };

  const retryVerification = () => {
    const pending = pendingVerifyRef.current;
    if (pending) void verifyPayment(pending.payload, pending.response);
  };

  const payButtonLabel = () => {
    switch (phase) {
        case 'creating': return 'Starting secure checkout…';
        case 'awaiting_payment': return 'Complete payment in the window…';
        case 'verifying': return 'Confirming your payment…';
        case 'error': return 'Try Again';
        default: return 'Pay Now';
    }
  };

  return (
    <section id="join-section" className="py-16 relative overflow-hidden flex items-center justify-center bg-transparent">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cinematic-black/10 via-cinematic-charcoal/40 to-cinematic-black pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cinematic-gold/20 to-cinematic-gold/5 border border-cinematic-gold/30 text-cinematic-gold text-sm font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-sm"
          >
            <Sparkles size={14} className="animate-spin-slow" /> Limited Slots Available
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl"
          >
            Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinematic-gold via-white to-cinematic-gold">Spotlight</span>
          </motion.h2>
          <p className="text-cinematic-textBody text-lg max-w-2xl mx-auto drop-shadow-md">
            Fill out the official application below to secure your lifetime membership card and enter the industry database.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* Visual Side - The 'Golden Ticket' Card */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-5/12 relative hidden lg:block"
            >
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-cinematic-gold/30 shadow-[0_0_60px_rgba(0,0,0,0.8)] group bg-black/40 backdrop-blur-xl transition-transform hover:scale-[1.02] duration-500">
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cinematic-charcoal/90 to-black/90"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                  
                  {/* Glowing Border Animation */}
                  <div className="absolute inset-0 border-2 border-cinematic-gold/50 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content inside the 'Ticket' */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <img
                          src="/images/Dhaari_Logo___2_-removebg-preview.png"
                          alt="DHAARI logo"
                          className="h-10 w-auto object-contain"
                        />
                        <div className="text-right">
                          <p className="text-cinematic-gold/60 text-xs font-mono uppercase tracking-widest">Serial No.</p>
                          <p className="text-white font-mono tracking-widest">DHA-2024-X99</p>
                        </div>
                      </div>
                      <div className="mt-12 text-center">
                        <div className="w-32 h-32 mx-auto rounded-full border-4 border-cinematic-gold/20 flex items-center justify-center bg-white/5 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
                          <div className="absolute inset-0 rounded-full border border-cinematic-gold/40 animate-pulse"></div>
                          <User size={48} className="text-cinematic-gold/50" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-1">{formData.firstName || 'Aspiring'} {formData.lastName || 'Talent'}</h3>
                        <p className="text-cinematic-textMuted text-sm uppercase tracking-widest">Membership Pending</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-cinematic-textMuted text-sm">Access Level</span>
                        <span className="text-cinematic-gold font-bold flex items-center gap-1"><Star size={12} fill="currentColor"/> All Features</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-cinematic-textMuted text-sm">Fee</span>
                        <span className="text-white font-bold">500 INR</span>
                      </div>
                      <div className="pt-2 text-center">
                        <p className="text-xs text-cinematic-textMuted/60 font-mono">AUTHORIZED BY DHAARI CASTING NETWORK</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Side */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-7/12"
            >
              <div className="bg-cinematic-charcoal/60 backdrop-blur-xl border border-cinematic-goldMuted/20 rounded-3xl p-8 md:p-10 shadow-2xl relative">
                
                {isSubmitted ? (
                   <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-20 flex flex-col items-center"
                 >
                   <div className="w-24 h-24 bg-cinematic-gold/20 text-cinematic-gold rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                     <Ticket className="w-12 h-12" />
                   </div>
                   <h3 className="text-4xl font-display font-bold text-white mb-4">You're In!</h3>
                   <p className="text-cinematic-textBody text-lg max-w-md leading-relaxed mb-8">
                     Your application has been successfully submitted. A confirmation email with your unique artist ID has been sent to your inbox.
                   </p>
                   <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="text-green-200 text-sm">Payment of 500 INR Verified</span>
                   </div>
                   <Button onClick={() => window.location.reload()} variant="outline" className="mt-8">
                       Submit Another Application
                   </Button>
                 </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cinematic-gold/30"></div>
                      <span className="text-cinematic-gold font-bold uppercase tracking-widest text-sm">Application Form</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cinematic-gold/30"></div>
                    </div>

                    {paymentError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                          <span>{paymentError.message}</span>
                        </div>
                        {paymentError.paymentId && (
                          <p className="text-red-400/70 text-xs font-mono pl-6">
                            Payment ID: {paymentError.paymentId}
                          </p>
                        )}
                        {paymentError.retryVerify && (
                          <button
                            type="button"
                            onClick={retryVerification}
                            disabled={phase === 'verifying'}
                            className="ml-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {phase === 'verifying' ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                            Retry confirmation
                          </button>
                        )}
                      </div>
                    )}

                    {phase === 'awaiting_payment' && !paymentError && (
                      <div className="p-4 bg-cinematic-gold/10 border border-cinematic-gold/30 rounded-lg text-cinematic-gold text-sm flex items-center gap-2">
                        <Lock size={16} className="shrink-0" />
                        Complete the payment in the Razorpay window. Do not close this tab.
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cinematic-textMuted uppercase tracking-wider ml-1">First Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cinematic-textMuted group-focus-within:text-cinematic-gold transition-colors w-5 h-5" />
                          <input 
                            name="firstName"
                            type="text" 
                            placeholder="e.g. Rahul"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full bg-cinematic-black/60 border ${formErrors.firstName ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                          />
                        </div>
                        {formErrors.firstName && <p className="text-red-500 text-xs ml-1">{formErrors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cinematic-textMuted uppercase tracking-wider ml-1">Last Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cinematic-textMuted group-focus-within:text-cinematic-gold transition-colors w-5 h-5" />
                          <input 
                            name="lastName"
                            type="text" 
                            placeholder="e.g. Verma"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full bg-cinematic-black/60 border ${formErrors.lastName ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                          />
                        </div>
                        {formErrors.lastName && <p className="text-red-500 text-xs ml-1">{formErrors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cinematic-textMuted uppercase tracking-wider ml-1">Contact Number</label>
                      <div className="relative group">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-cinematic-textMuted group-focus-within:text-cinematic-gold transition-colors w-5 h-5" />
                        <input 
                          name="phone"
                          type="tel" 
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full bg-cinematic-black/60 border ${formErrors.phone ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                        />
                      </div>
                      {formErrors.phone && <p className="text-red-500 text-xs ml-1">{formErrors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cinematic-textMuted uppercase tracking-wider ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cinematic-textMuted group-focus-within:text-cinematic-gold transition-colors w-5 h-5" />
                        <input 
                          name="email"
                          type="email" 
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-cinematic-black/60 border ${formErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                        />
                      </div>
                      {formErrors.email && <p className="text-red-500 text-xs ml-1">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cinematic-textMuted uppercase tracking-wider ml-1">Role</label>
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className={`w-full bg-cinematic-black/60 border ${formErrors.role ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-4 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                        >
                          <option value="">Select your role</option>
                          <option>Actor</option>
                          <option>Director</option>
                          <option>Writer</option>
                          <option>Cinematographer</option>
                          <option>Musician</option>
                          <option>Editor</option>
                          <option>Designer</option>
                          <option>Dancer</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {formData.role === 'Other' && (
                        <div className="mt-2">
                          <input
                            name="roleOther"
                            type="text"
                            placeholder="Please specify your role"
                            value={formData.roleOther}
                            onChange={handleInputChange}
                            className={`w-full bg-cinematic-black/60 border ${formErrors.roleOther ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3 px-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                          />
                        </div>
                      )}
                      {formErrors.role && <p className="text-red-500 text-xs ml-1">{formErrors.role}</p>}
                      {formErrors.roleOther && <p className="text-red-500 text-xs ml-1">{formErrors.roleOther}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cinematic-textMuted uppercase tracking-wider ml-1">Address</label>
                      <div className="relative group">
                        <input 
                          name="address"
                          type="text" 
                          placeholder="Street address, city, state"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full bg-cinematic-black/60 border ${formErrors.address ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-cinematic-gold focus:ring-1 focus:ring-cinematic-gold transition-all`}
                        />
                      </div>
                      {formErrors.address && <p className="text-red-500 text-xs ml-1">{formErrors.address}</p>}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full py-5 text-lg shadow-[0_0_30px_rgba(198,40,40,0.4)] hover:shadow-[0_0_50px_rgba(198,40,40,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isBusy}
                      >
                        {isBusy ? (
                          <span className="inline-flex items-center gap-3 justify-center">
                            <Loader2 className="animate-spin w-5 h-5" />
                            {payButtonLabel()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 justify-center">
                            <Lock size={16} /> {payButtonLabel()}
                          </span>
                        )}
                      </Button>
                      <p className="text-center text-cinematic-textMuted/60 text-xs mt-3">
                        Secure payment via Razorpay · 500 INR one-time
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ContactSection;