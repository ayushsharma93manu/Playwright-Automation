import { randomUUID } from 'crypto';

export interface UserData {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  dobDay: string;
  dobMonth: string; // numeric value used by the <select> (1-12)
  dobYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

/** Short unique token: timestamp + random UUID fragment => unique even across parallel workers. */
function uniqueToken(): string {
  return `${Date.now()}${randomUUID().replace(/-/g, '').slice(0, 6)}`;
}

export function uniqueEmail(prefix = 'qa'): string {
  return `${prefix}.${uniqueToken()}@example.com`;
}

/** Builds a fully populated, unique user. Nothing is hard-coded to a real account. */
export function buildUser(overrides: Partial<UserData> = {}): UserData {
  const token = uniqueToken();
  return {
    title: 'Mr',
    name: `qauser${token}`,
    email: `qa.${token}@example.com`,
    password: `Pwd@${token.slice(-8)}`,
    dobDay: '15',
    dobMonth: '5',
    dobYear: '1990',
    firstName: 'Auto',
    lastName: 'Tester',
    company: 'QA Labs',
    address1: '221B Test Street',
    address2: 'Block C',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    zipcode: '110001',
    mobile: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
    ...overrides,
  };
}
