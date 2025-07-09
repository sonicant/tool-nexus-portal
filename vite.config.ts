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
          rewrite: (path) => path.replace(/^\/api\/dns-google/, '/resolve'),
          secure: true
        },
        '/api/dns-cloudflare': {
          target: 'https://cloudflare-dns.com/dns-query',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/dns-cloudflare/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('Accept', 'application/dns-message');
            });
          },
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
