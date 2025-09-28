import { defineConfig } from 'vite';

// Nombre EXACTO del repo en GitHub Pages
const repo = 'unie-simulaciones-v2';

export default defineConfig({
  base: `/${repo}/`,   // requerido en GitHub Pages
});
