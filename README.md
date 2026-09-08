# DHAARI — Run & Deploy

## About

DHAARI is a community-driven platform for emerging filmmakers and storytellers. This repository contains the front-end React + Vite application used by the project.

Key features:

- Clean, responsive landing page and hero sections
- Join and contact forms to connect creators
- Galleries, testimonials, and timeline components
- Admin and user dashboards for managing content and workshops

**Human Authorship**

All code and written content in this repository were created and reviewed by the DHAARI team. If you have questions about authorship or need clarification, please contact us at <span class="text-cinematic-gold">info@dhaari.org</span>.

**Contributing**

Contributions are welcome. Please open an issue to discuss substantial changes before submitting a pull request. Keep contributions respectful, include a clear description of changes, and add tests where applicable.

If you'd like to contribute or report issues, check the repository issues or open a pull request with a clear description of your change.

## Run Locally / Development

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. If your app requires API keys, add them to [.env.local](.env.local)
3. Run the app:
   `npm run dev`

## Application form -> Razorpay payment -> email (no database)

The "Claim Your Spotlight" form charges 500 INR through Razorpay, then emails the
application. Nothing is stored in a database.

Serverless functions ([api/](api/)):

| Route | Purpose |
|---|---|
| `create-order.ts` | Validates the form, creates a Razorpay order (secret stays server-side, 12s timeout on the gateway call) |
| `verify-payment.ts` | Verifies the HMAC-SHA256 signature, cross-checks the payment status with Razorpay, then emails the application (idempotent per `payment_id`) |
| `_email.ts` | Shared Gmail SMTP sender + validation (not an HTTP route) |
| `_razorpay.ts` | Shared Razorpay helpers: credentials, amount, `fetchWithTimeout`, error shape |

Client flow ([components/ContactSection.tsx](components/ContactSection.tsx)):
`idle -> creating -> awaiting_payment -> verifying -> done`, with any step able
to drop to `error`. Key behaviours:

- Form is validated before an order is created.
- If the browser cannot reach the server **after** payment, the UI keeps the
  signed response and offers **"Retry confirmation"** — it never re-charges.
- Closing the Razorpay window without paying shows "not charged" and returns to
  `idle`; `payment.failed` shows the gateway reason.
- Once a payment exists, the main button retries confirmation instead of
  starting a new payment.

Server responses are `{ error, code }` with codes:
`METHOD_NOT_ALLOWED`, `BAD_JSON`, `VALIDATION`, `GATEWAY_NOT_CONFIGURED`,
`GATEWAY_TIMEOUT`, `GATEWAY_UNREACHABLE`, `GATEWAY_REJECTED` (create-order);
`MISSING_FIELDS`, `SIGNATURE_INVALID`, `PAYMENT_NOT_COMPLETED` (verify-payment).
After the signature is validated, verify-payment always returns `2xx`
(`{ success: true, emailed: bool, warning? }`) because the money has been taken —
an email failure is logged and the applicant's details remain on the Razorpay
order `notes` as a fallback record.

Emails (Gmail SMTP, ~500/day, any recipient):
- Admin notification -> `dhaariinfo@gmail.com`
- Applicant confirmation -> the email typed in the form

Locally, `npm run dev` serves the `api/` folder too (see the `api-dev-server`
plugin in [vite.config.ts](vite.config.ts)). It reads `.env.local`.

### Environment variables

Add these in Vercel -> Project -> Settings -> Environment Variables (and in
`.env.local` for local dev):

| Variable | Value |
|---|---|
| `EMAIL_SENDER` | `dhaariinfo@gmail.com` |
| `EMAIL_PASSWORD` | Gmail **App Password** (Google Account -> Security -> 2-Step Verification -> App passwords) |
| `SMTP_SERVER` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `RAZORPAY_KEY_ID` | from Razorpay Dashboard -> Settings -> API Keys |
| `RAZORPAY_KEY_SECRET` | same screen — **server only, never commit** |

The Razorpay checkout script is already in [index.html](index.html). The amount
defaults to 50000 paise (500 INR); override with the optional
`RAZORPAY_AMOUNT_PAISE` env var.
