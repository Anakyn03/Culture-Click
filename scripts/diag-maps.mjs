// One-off diagnostic: dump the rejection body from Google's Embed API.
import { readFileSync } from 'node:fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const line = env.split(/\r?\n/).find((l) => l.startsWith('VITE_GOOGLE_MAPS_API_KEY='));
const key = line?.split('=')[1]?.trim();

const url = `https://www.google.com/maps/embed/v1/place?key=${key}&q=26.9855,75.8513&zoom=14`;
const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
const text = await res.text();
console.log('status:', res.status);
// Google's embed error pages contain a jsload/bootstrap message or plain text reason.
const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log('body (first 600 chars):', stripped.slice(0, 600));
// Also try the embeddings endpoint which returns JSON errors
const res2 = await fetch(`https://www.google.com/maps/embed/v1/place?key=${key}&q=0,0`, { headers: { 'User-Agent': 'curl/8' } });
const text2 = await res2.text();
console.log('--- plain UA status:', res2.status, 'body:', text2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400));
