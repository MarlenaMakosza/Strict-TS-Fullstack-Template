import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// In development the browser talks only to Vite; Vite forwards /api to the backend, so the two
// need no CORS setup. API_URL points it at a backend on another address.
const apiUrl = process.env['API_URL'] ?? 'http://localhost:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: { '/api': apiUrl },
  },
});
