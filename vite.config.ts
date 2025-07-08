import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/dns-google': {
        target: 'https://dns.google',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dns-google/, '/dns-query'),
        secure: true
      },
      '/api/dns-cloudflare': {
        target: 'https://cloudflare-dns.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dns-cloudflare/, '/dns-query'),
        secure: true
      },
      '/api/dns-quad9': {
        target: 'https://dns.quad9.net:5053',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dns-quad9/, '/dns-query'),
        secure: true
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
