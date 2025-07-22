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
    cors: true,
    // 移除 X-Frame-Options 以允许 iframe 嵌入
    // headers: {
    //   'X-Frame-Options': 'SAMEORIGIN',
    // },
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
  optimizeDeps: {
    include: ['mermaid', 'katex', 'cytoscape'],
    exclude: []
  },
  build: {
    // 模块兼容性配置
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    // SEO优化：代码分割和资源优化
    rollupOptions: {
      output: {
        format: 'es',
        // 优化代码分割以提升SEO性能
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-slot', 'class-variance-authority', 'clsx'],
          'vendor-tools': ['mermaid', 'qrcode', 'js-yaml']
        },
        // 优化资源命名以便缓存
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 启用源码映射以便调试
    sourcemap: mode === 'development',
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        // SEO优化：移除未使用代码
        unused: true,
        dead_code: true
      }
    },
    // SEO优化：资源内联阈值
    assetsInlineLimit: 4096,
    // 启用CSS代码分割
    cssCodeSplit: true
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
