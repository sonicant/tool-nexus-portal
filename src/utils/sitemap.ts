import { tools } from '@/registry/toolRegistry';
import { defaultSEOConfig } from '@/config/seo';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

// 生成sitemap数据
export function generateSitemapData(): SitemapUrl[] {
  const currentDate = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // 添加首页
  urls.push({
    loc: defaultSEOConfig.siteUrl,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '1.0'
  });

  // 添加所有工具页面
  tools.forEach(tool => {
    urls.push({
      loc: `${defaultSEOConfig.siteUrl}/tools/${tool.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  return urls;
}

// 生成XML格式的sitemap
export function generateSitemapXML(): string {
  const urls = generateSitemapData();
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';
  
  const urlElements = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');
  
  return `${xmlHeader}
${urlsetOpen}${urlElements}
${urlsetClose}`;
}

// 生成robots.txt内容
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${defaultSEOConfig.siteUrl}/sitemap.xml`;
}

// 在开发环境中生成sitemap文件
export function downloadSitemap() {
  const sitemapXML = generateSitemapXML();
  const blob = new Blob([sitemapXML], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 在开发环境中生成robots.txt文件
export function downloadRobotsTxt() {
  const robotsTxt = generateRobotsTxt();
  const blob = new Blob([robotsTxt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'robots.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}