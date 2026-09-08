// Vercel Serverless Function — creates a Razorpay order for the membership fee.
// The key SECRET never leaves the server.
//
// Request  (POST JSON): the application fields (firstname, lastname, ...).
// Response (200):        { orderId, amount, currency, keyId }
// Response (4xx/5xx):    { error, code }
//
// Env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, (optional) RAZORPAY_AMOUNT_PAISE

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateApplication, parseApplication } from './_lib/application';
import {
  RAZORPAY_BASE,
  CURRENCY,
  getAmountPaise,
  getCredentials,
  fetchWithTimeout,
  fail,
  readJsonBody,
} from './_lib/razorpay';

const LOG = '[create-order]';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await run(req, res);
  } catch (err: any) {
    // Surface the real cause instead of a blank 500 while we debug.
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
    console.error(LOG, 'missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET', {
      hasId: !!process.env.RAZORPAY_KEY_ID,
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
    });
    return fail(res, 500, 'GATEWAY_NOT_CONFIGURED', 'Payment gateway not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing in this deployment)');
  }

  const parsed = readJsonBody(req);
  if (!parsed.ok) {
    return fail(res, 400, 'BAD_JSON', 'Request body must be valid JSON');
  }
  const b = parsed.body;

  const data = parseApplication(b);

  const validationError = validateApplication(data);
  if (validationError) {
    return fail(res, 400, 'VALIDATION', validationError);
  }

  const amount = getAmountPaise();

  let rzpRes: Response;
  try {
    rzpRes = await fetchWithTimeout(`${RAZORPAY_BASE}/orders`, {
      method: 'POST',
      headers: { Authorization: creds.authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: CURRENCY,
        receipt: `dha_${Date.now()}`,
        // Stored on the order — a fallback record if the email ever fails.
        notes: {
          name: `${data.firstname} ${data.lastname}`,
          email: data.email,
          phone: data.contact_no,
          role: data.role === 'Other' ? `Other - ${data.other_description}` : data.role,
        },
      }),
    });
  } catch (err: any) {
    const timedOut = err?.message === 'TIMEOUT';
    console.error(LOG, timedOut ? 'razorpay timeout' : 'razorpay network error', err?.message || err);
    return fail(
      res,
      504,
      timedOut ? 'GATEWAY_TIMEOUT' : 'GATEWAY_UNREACHABLE',
      'Could not reach the payment gateway. Please try again.'
    );
  }

  let order: any = null;
  try {
    order = await rzpRes.json();
  } catch {
    /* non-JSON body */
  }

  if (!rzpRes.ok || !order?.id) {
    console.error(LOG, 'razorpay rejected order', rzpRes.status, order);
    const desc = order?.error?.description;
    return fail(
      res,
      502,
      'GATEWAY_REJECTED',
      desc ? `Payment gateway error: ${desc}` : 'Could not create the payment order.'
    );
  }

  return res.status(200).json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: creds.keyId, // public key — safe for the browser
  });
}
