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
        manualChunks: {
          // 将工具组件分离到单独的chunk
          'tools': [
            './src/tools/regex-tester/RegexTesterTool.tsx',
            './src/tools/json-xml-converter/JsonXmlConverterTool.tsx',
            './src/tools/timestamp-converter/TimestampConverterTool.tsx',
            './src/tools/uuid-generator/UuidGeneratorTool.tsx',
            './src/tools/text-diff/TextDiffTool.tsx',
            './src/tools/text-hash/TextHashTool.tsx',
            './src/tools/url-encoder/UrlEncoderTool.tsx',
            './src/tools/qr-generator/QrGeneratorTool.tsx',
            './src/tools/yaml-toml-converter/YamlTomlConverterTool.tsx',
            './src/tools/xml-validator/XmlValidatorTool.tsx',
            './src/tools/subnet-calculator/SubnetCalculatorTool.tsx',
            './src/tools/dns-query/DnsQueryTool.tsx',
            './src/tools/http-request-builder/HttpRequestBuilderTool.tsx',
            './src/tools/json-diff/JsonDiffTool.tsx',
            './src/tools/mermaid-renderer/MermaidRendererTool.tsx',
            './src/tools/pcap-analyzer/PcapAnalyzerTool.tsx'
          ],
          // UI组件库
          'ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // 第三方库
          'vendor': ['react', 'react-dom', 'react-router-dom']
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
