import { useEffect } from 'react';
import { defaultSEOConfig, getToolSEO, generateStructuredData } from '@/config/seo';

interface SEOHeadProps {
  toolId?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}

export const SEOHead = ({ 
  toolId, 
  title, 
  description, 
  keywords, 
  image 
}: SEOHeadProps) => {
  useEffect(() => {
    // 获取工具特定的SEO配置
    const toolSEO = toolId ? getToolSEO(toolId) : null;
    
    // 确定最终的SEO数据
    const finalTitle = title || toolSEO?.fullTitle || defaultSEOConfig.title;
    const finalDescription = description || toolSEO?.description || defaultSEOConfig.description;
    const finalKeywords = keywords || toolSEO?.keywords || defaultSEOConfig.keywords;
    const finalImage = image || defaultSEOConfig.defaultImage;
    const currentUrl = toolId ? `${defaultSEOConfig.siteUrl}/tools/${toolId}` : defaultSEOConfig.siteUrl;

    // 更新页面标题
    document.title = finalTitle;

    // 更新或创建meta标签的辅助函数
    const updateMetaTag = (selector: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) meta.setAttribute('property', property);
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 更新基础meta标签
    updateMetaTag('meta[name="description"]', finalDescription);
    updateMetaTag('meta[name="keywords"]', finalKeywords.join(', '));
    
    // 更新Open Graph标签
    updateMetaTag('meta[property="og:title"]', finalTitle);
    updateMetaTag('meta[property="og:description"]', finalDescription);
    updateMetaTag('meta[property="og:url"]', currentUrl);
    updateMetaTag('meta[property="og:image"]', finalImage);
    
    // 更新Twitter标签
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', finalTitle);
    updateMetaTag('meta[name="twitter:description"]', finalDescription);
    updateMetaTag('meta[name="twitter:image"]', finalImage);
    updateMetaTag('meta[name="twitter:site"]', '@toolnexusportal');
    updateMetaTag('meta[name="twitter:creator"]', '@toolnexusportal');

    // 添加额外的社交媒体标签
    updateMetaTag('meta[property="og:type"]', toolId ? 'article' : 'website');
    updateMetaTag('meta[property="og:site_name"]', defaultSEOConfig.siteName);
    updateMetaTag('meta[property="og:locale"]', 'en_US');
    updateMetaTag('meta[property="article:author"]', defaultSEOConfig.author);
    
    // 添加主题色标签
    updateMetaTag('meta[name="theme-color"]', '#3b82f6');
    updateMetaTag('meta[name="msapplication-TileColor"]', '#3b82f6');

    // 更新canonical链接
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 更新结构化数据
    const structuredData = generateStructuredData(toolId);
    let jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData, null, 2);

  }, [toolId, title, description, keywords, image]);

  return null; // 这个组件不渲染任何内容
};

export default SEOHead;