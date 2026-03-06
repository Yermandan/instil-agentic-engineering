import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  base: '/agentic-engineering/',
  build: {
    outDir: 'dist',
  },
});
