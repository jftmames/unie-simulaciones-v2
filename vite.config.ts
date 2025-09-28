import { defineConfig } from 'vite';

// Si GH_PAGES=1, usamos base '/<REPO_NAME>/', si no, './' (Vercel)
const base = process.env.GH_PAGES ? '/unie-simulaciones-v3/' : './';

export default defineConfig({ base });
