// Vercel Serverless Function — verifies a Razorpay payment, then emails the
// application. Called by the frontend from Razorpay's success handler.
//
// Steps:
//   1. Check the signature:  HMAC-SHA256(order_id + "|" + payment_id, SECRET)
//   2. (defence in depth) Ask Razorpay for the payment and confirm it is
//      captured/authorised for the right amount.
//   3. Send the application email (idempotent per payment_id).
//
// Once the signature is valid the money has been taken, so from that point the
// response is always 2xx — an email failure is logged and reported as a warning,
// never as a hard error the applicant sees after paying.

import crypto from 'crypto';
import { validateApplication, parseApplication, type ApplicationData } from '../lib/application';
import { sendApplicationEmails } from '../lib/email';
import {
  RAZORPAY_BASE,
  getAmountPaise,
  getCredentials,
  fetchWithTimeout,
  fail,
} from '../lib/razorpay';

const LOG = '[verify-payment]';

// Best-effort idempotency within a warm lambda: don't email twice for the same
// payment if the client retries. Resets on cold start (acceptable — worst case
// is a duplicate email, never a double charge).
const handledPayments = new Set<string>();

function signatureValid(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Returns null if the payment looks good, or an error string. Network failures return null (don't block a signed payment). */
async function confirmWithRazorpay(paymentId: string, authHeader: string): Promise<string | null> {
  let r: Response;
  try {
    r = await fetchWithTimeout(`${RAZORPAY_BASE}/payments/${paymentId}`, {
      headers: { Authorization: authHeader },
    }, 10000);
  } catch (err: any) {
    console.warn(LOG, 'could not fetch payment for cross-check (allowing):', err?.message || err);
    return null;
  }

  let payment: any = null;
  try {
    payment = await r.json();
  } catch {
    /* ignore */
  }
  if (!r.ok || !payment?.id) {
    console.warn(LOG, 'payment lookup failed (allowing):', r.status, payment);
    return null;
  }

  if (!['captured', 'authorized'].includes(payment.status)) {
    return `Payment status is "${payment.status}"`;
  }
  const expected = getAmountPaise();
  if (typeof payment.amount === 'number' && payment.amount < expected) {
    return `Paid amount ${payment.amount} is less than required ${expected}`;
  }
  return null;
}

export default async function handler(req: any, res: any) {
  try {
    return await run(req, res);
  } catch (err: any) {
    console.error(LOG, 'UNHANDLED', err?.stack || err?.message || err);
    return fail(res, 500, 'SERVER_ERROR', `Unhandled: ${err?.message || String(err)}`);
  }
}

async function run(req: any, res: any) {
  if (req.method !== 'POST') {
    return fail(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
  }

  const creds = getCredentials();
  if (!creds.ok) {
    console.error(LOG, 'missing Razorpay credentials');
    return fail(res, 500, 'GATEWAY_NOT_CONFIGURED', 'Payment gateway not configured');
  }

  let b: any = req.body;
  if (typeof b === 'string') {
    try {
      b = JSON.parse(b);
    } catch {
      return fail(res, 400, 'BAD_JSON', 'Request body must be valid JSON');
    }
  }
  b = b ?? {};

  const orderId = String(b.razorpay_order_id ?? '');
  const paymentId = String(b.razorpay_payment_id ?? '');
  const signature = String(b.razorpay_signature ?? '');

  if (!orderId || !paymentId || !signature) {
    return fail(res, 400, 'MISSING_FIELDS', 'Missing payment confirmation fields');
  }

  if (!signatureValid(orderId, paymentId, signature, creds.keySecret)) {
    console.error(LOG, 'SIGNATURE MISMATCH', { orderId, paymentId });
    return fail(res, 400, 'SIGNATURE_INVALID', 'Payment could not be verified');
  }

  // Signature is genuine from here on. The payment is real.

  if (handledPayments.has(paymentId)) {
    return res.status(200).json({ success: true, duplicate: true, paymentId });
  }

  const crossCheckError = await confirmWithRazorpay(paymentId, creds.authHeader);
  if (crossCheckError) {
    console.error(LOG, 'cross-check failed:', paymentId, crossCheckError);
    return fail(res, 400, 'PAYMENT_NOT_COMPLETED', 'Your payment has not completed. If money was deducted it will be refunded automatically.');
  }

  const data: ApplicationData = {
    ...parseApplication(b),
    payment_id: paymentId,
  };

  // Form data is validated before create-order, so a failure here is an edge
  // case. The applicant already paid — don't block them; log so it's handled
  // manually (the applicant details are also on the Razorpay order notes).
  const validationError = validateApplication(data);
  if (validationError) {
    console.error(LOG, 'PAID but form invalid:', paymentId, validationError, data);
    handledPayments.add(paymentId);
    return res.status(200).json({ success: true, emailed: false, paymentId, warning: 'ADMIN_FOLLOWUP_REQUIRED' });
  }

  try {
    await sendApplicationEmails(data);
    handledPayments.add(paymentId);
    return res.status(201).json({ success: true, emailed: true, paymentId });
  } catch (err: any) {
    // Money taken, email failed. Still a success for the applicant; the
    // Razorpay dashboard (order notes) has their details as a fallback.
    console.error(LOG, 'PAID but email failed:', paymentId, err?.message || err);
    handledPayments.add(paymentId);
    return res.status(200).json({ success: true, emailed: false, paymentId, warning: 'EMAIL_FAILED' });
  }
}
