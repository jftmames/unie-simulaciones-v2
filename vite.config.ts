import { defineConfig } from 'vite';

// Detecta si estamos en GitHub Pages (donde la URL lleva .github.io)
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.GH_PAGES === '1';

// Nombre del repo (ajústalo si lo renombras en GitHub)
const repoName = 'unie-simulaciones-v2';

export default defineConfig({
  base: isGitHubPages ? `/${repoName}/` : './',
});
