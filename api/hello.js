// Plain JavaScript (.js), zero imports. Bypasses the TypeScript build entirely.
// If /api/hello works but /api/ping (.ts) does not, the problem is the TS config.
module.exports = (req, res) => {
  res.status(200).json({ ok: true, kind: 'plain-js', node: process.version });
};
