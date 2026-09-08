// Pure application-data types + validation. NO imports / dependencies, so any
// API route can import it without pulling in nodemailer or anything else.

export const ALLOWED_ROLES = [
  'Actor', 'Director', 'Writer', 'Cinematographer',
  'Musician', 'Editor', 'Designer', 'Dancer', 'Other',
];

export interface ApplicationData {
  firstname: string;
  lastname: string;
  contact_no: string;
  email: string;
  address: string;
  role: string;
  other_description?: string;
  payment_id?: string;
}

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Validates the payload. Returns an error string, or null when valid. */
export function validateApplication(d: ApplicationData): string | null {
  if (!d.firstname || !d.lastname || !d.contact_no || !d.email || !d.address || !d.role) {
    return 'All fields are required';
  }
  if (!isValidEmail(d.email)) return 'Invalid email format';
  if (!ALLOWED_ROLES.includes(d.role)) return 'Invalid role selected';
  if (d.role === 'Other' && !d.other_description) {
    return "Description is required when role is 'Other'";
  }
  return null;
}

/** Reads and trims the application fields from a request body. */
export function parseApplication(b: any): ApplicationData {
  return {
    firstname: String(b?.firstname ?? '').trim(),
    lastname: String(b?.lastname ?? '').trim(),
    contact_no: String(b?.contact_no ?? '').trim(),
    email: String(b?.email ?? '').trim().toLowerCase(),
    address: String(b?.address ?? '').trim(),
    role: String(b?.role ?? '').trim(),
    other_description: String(b?.other_description ?? '').trim(),
  };
}
