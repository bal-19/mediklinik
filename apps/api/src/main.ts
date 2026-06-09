import { createApp } from './server';

const app = createApp();

const port = Number(process.env.PORT ?? 3000);

console.log(`MediKlinik API listening on http://localhost:${port}`);

export default app;
