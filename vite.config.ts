import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // No manualChunks. Forcing three/drei into a named chunk made the bundler
    // hoist React and react-dom in there too, and the entry then imported
    // them from it — so every visitor, phone included, downloaded 264kB of
    // gzipped WebGL whether or not a canvas was ever rendered. The default
    // splitting already gives the dynamic import('./Assembly') its own chunk.
  },
});
