// Shared Razorpay helpers for the API routes. Lives under api/_lib/ — Vercel
// ignores underscore-prefixed paths, so these are bundled but never routed.

export const RAZORPAY_BASE = 'https://api.razorpay.com/v1';
export const CURRENCY = 'INR';

/** Amount charged, in paise. Override with RAZORPAY_AMOUNT_PAISE. Default 50000 (500 INR). */
export function getAmountPaise(): number {
  const raw = Number(process.env.RAZORPAY_AMOUNT_PAISE);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 50000;
}

export function getCredentials():
  | { ok: true; keyId: string; keySecret: string; authHeader: string }
  | { ok: false } {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return { ok: false };
  return {
    ok: true,
    keyId,
    keySecret,
    authHeader: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
  };
}

/** fetch() with a hard timeout. Throws Error('TIMEOUT') or the underlying network error. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 12000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('TIMEOUT');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** Standard JSON error response with a machine-readable code. */
export function fail(res: any, status: number, code: string, message: string) {
  return res.status(status).json({ error: message, code });
}

/**
 * Reads the JSON body off a Vercel request. Vercel parses it for us when the
 * client sends `Content-Type: application/json`, but hands back a raw string or
 * Buffer otherwise — accept all three rather than silently seeing an empty body.
 */
export function readJsonBody(req: any): { ok: true; body: any } | { ok: false } {
  let b: any = req?.body;
  if (b === undefined || b === null || b === '') return { ok: true, body: {} };
  if (Buffer.isBuffer(b)) b = b.toString('utf8');
  if (typeof b === 'string') {
    try {
      b = JSON.parse(b);
    } catch {
      return { ok: false };
    }
  }
  return { ok: true, body: b ?? {} };
}
