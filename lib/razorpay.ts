// Shared Razorpay helpers for the API routes (filename starts with "_" so
// Vercel does not treat it as an HTTP route).

export const RAZORPAY_BASE = 'https://api.razorpay.com/v1';
export const CURRENCY = 'INR';

/** Amount charged, in paise. Override with RAZORPAY_AMOUNT_PAISE. Default 50000 (500 INR). */
export function getAmountPaise(): number {
  const raw = Number(process.env.RAZORPAY_AMOUNT_PAISE);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 100;
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
