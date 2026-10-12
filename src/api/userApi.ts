import { APIRequestContext } from '@playwright/test';
import { UserData } from '../data/userFactory';

/**
 * The site exposes REST helpers (/api/createAccount, /api/deleteAccount).
 * They are used ONLY for test setup/teardown so UI tests stay independent
 * and fast. The HTTP status is always 200; the real status lives in the body.
 */
async function parseBody(text: string): Promise<{ responseCode: number; message: string }> {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Unexpected API response: ${text.slice(0, 200)}`);
  }
}

export async function createUserViaApi(request: APIRequestContext, user: UserData): Promise<void> {
  const res = await request.post('/api/createAccount', {
    form: {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.dobDay,
      birth_month: user.dobMonth,
      birth_year: user.dobYear,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile,
    },
  });
  const body = await parseBody(await res.text());
  if (body.responseCode !== 201) {
    throw new Error(`createAccount failed: ${body.responseCode} - ${body.message}`);
  }
}

/** Best-effort delete: never throws (account may already be deleted by the test itself). */
export async function deleteUserViaApi(request: APIRequestContext, user: UserData): Promise<void> {
  try {
    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
  } catch {
    /* ignore - cleanup must never fail a test */
  }
}
