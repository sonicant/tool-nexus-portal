import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 添加基础路径配置
  base: '/',
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
  build: {
    // SEO优化：代码分割
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep React and React-DOM together to avoid context issues
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui';
            }
            // Separate visualization libraries to avoid dependency conflicts
            if (id.includes('mermaid')) {
              return 'mermaid';
            }
            if (id.includes('katex')) {
              return 'katex';
            }
            if (id.includes('cytoscape')) {
              return 'cytoscape';
            }
            return 'vendor';
          }
          // Group tools together
          if (id.includes('/src/tools/')) {
            return 'tools';
          }
        }
      }
    },
    // 启用源码映射以便调试
    sourcemap: mode === 'development',
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  }
  // 移除实验性配置，这可能导致生产环境资源路径问题
  // experimental: {
  //   renderBuiltUrl(filename, { hostType }) {
  //     if (hostType === 'js') {
  //       return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` };
  //     } else {
  //       return { relative: true };
  //     }
  //   }
  // }
}));
