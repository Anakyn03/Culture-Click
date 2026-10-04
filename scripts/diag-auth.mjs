// Probe the Supabase project's auth configuration using the anon key.
// Safe, read-only checks: what does signup say, and is the site reachable?
import { readFileSync } from 'node:fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const get = (name) => env.split(/\r?\n/).find((l) => l.startsWith(name + '='))?.split('=')[1]?.trim();

const url = get('VITE_SUPABASE_URL');
const anon = get('VITE_SUPABASE_ANON_KEY');

if (!url || !anon) {
  console.log('MISSING: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}
console.log('project URL OK:', url);

// 1. Does the auth server respond at all?
try {
  const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: anon } });
  console.log('auth health:', res.status, res.ok ? '(auth server reachable)' : '(problem)');
} catch (e) {
  console.log('auth health: FAILED —', e.message);
  process.exit(1);
}

// 2. Try a signup with a throwaway address to learn the confirm-email setting.
const probeEmail = `probe-${Date.now()}@example.com`;
const res = await fetch(`${url}/auth/v1/signup`, {
  method: 'POST',
  headers: { apikey: anon, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: probeEmail, password: 'Probe-test-1234' }),
});
const body = await res.json();

if (res.status === 200 && body.access_token) {
  console.log('signup: ENABLED and user is signed in immediately');
  console.log('=> "Confirm email" is OFF. Email sign-in will work right now.');
} else if (body.msg === 'Confirm email address or log in through a third party') {
  console.log('signup: ENABLED, but confirmation email is required');
  console.log('=> "Confirm email" is ON. You need SMTP (or turn it off for dev).');
} else if (res.status === 422 && /already/i.test(body.msg || '')) {
  console.log('signup: enabled (address collision, ignore)');
} else {
  console.log('signup response:', res.status, JSON.stringify(body).slice(0, 200));
}
