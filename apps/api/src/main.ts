import { createApp } from './server';

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  async fetch(request) {
    const origin = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });
    const response = await app.fetch(request);
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders(origin))) headers.set(key, value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
});

console.log(`MediKlinik API listening on http://localhost:${port}`);
console.log(`MediKlinik API docs available at http://localhost:${port}/docs`);

export default app;

function corsHeaders(origin: string) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-headers': 'authorization, content-type, x-clinic-id, x-user-id, x-role, x-subscription-status',
    'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'access-control-allow-credentials': 'true',
  };
}
