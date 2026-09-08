// Diagnostic endpoint — zero imports. If GET /api/ping also fails with
// FUNCTION_INVOCATION_FAILED, the problem is the Vercel project config
// (Node version / build), not our function code.

export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    node: process.version,
    hasRazorpayId: !!process.env.RAZORPAY_KEY_ID,
    hasRazorpaySecret: !!process.env.RAZORPAY_KEY_SECRET,
    hasEmailSender: !!process.env.EMAIL_SENDER,
    hasEmailPassword: !!process.env.EMAIL_PASSWORD,
  });
}
