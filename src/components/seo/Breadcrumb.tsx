import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getToolById } from '@/registry/toolRegistry';
import { useI18n } from '@/hooks/useI18n';
import { toolSEOConfigs } from '@/config/seo';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export const Breadcrumb = () => {
  const location = useLocation();
  const { t, language } = useI18n();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('common.home'), href: '/' }
    ];

    if (pathSegments.length === 0) {
      breadcrumbs[0].current = true;
      return breadcrumbs;
    }

    // 处理工具页面路径 /tools/:toolId
    if (pathSegments[0] === 'tools' && pathSegments[1]) {
      const toolId = pathSegments[1];
      const tool = getToolById(toolId);
      const toolSEO = toolSEOConfigs[toolId];
      
      breadcrumbs.push({
        label: t('common.tools'),
        href: '/'
      });
      
      const toolName = tool?.name ? (typeof tool.name === 'string' ? tool.name : tool.name[language] || tool.name['en'] || Object.values(tool.name)[0]) : toolId;
      
      breadcrumbs.push({
        label: toolSEO?.title || toolName,
        current: true
      });
    } else {
      // 处理其他路径
      pathSegments.forEach((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: isLast ? undefined : href,
          current: isLast
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // 如果只有首页，不显示面包屑
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // 生成结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${window.location.origin}${item.href}` : window.location.href
    }))
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* 面包屑导航 */}
      <nav 
        className="flex items-center space-x-1 text-sm text-muted-foreground mb-6"
        aria-label={t('common.tools')}
      >
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
            )}
            
            {item.current ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href!} 
                className="hover:text-foreground transition-colors"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb;