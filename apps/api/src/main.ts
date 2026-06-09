import { createApp } from './server';

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  fetch(request) {
    return app.fetch(request);
  },
});

console.log(`MediKlinik API listening on http://localhost:${port}`);
console.log(`MediKlinik API docs available at http://localhost:${port}/docs`);

export default app;
