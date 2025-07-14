import { useState, useMemo } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { tools } from '@/registry/toolRegistry';
import { ToolCard } from '@/components/layout/ToolCard';
import SEOHead from '@/components/seo/SEOHead';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';

const Index = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => {
      const toolName = t(`tools.${tool.id}.name`).toLowerCase();
      const toolDescription = t(`tools.${tool.id}.description`).toLowerCase();
      const toolId = tool.id.toLowerCase();
      
      return toolName.includes(query) || 
             toolDescription.includes(query) || 
             toolId.includes(query);
    });
  }, [searchQuery, t]);

  return (
    <>
      <SEOHead />
      <div className="container mx-auto py-12 space-y-12">


      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          {t('common.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('common.description')}
        </p>
        
        {/* Search Box */}
        <div className="max-w-md mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* All Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('common.noToolsFound')}
            </p>
          </div>
        )}
       </div>
       
       {/* Suggest New Tool Button */}
       <div className="flex justify-center mt-12">
         <Button 
           variant="outline" 
           size="sm"
           onClick={() => window.open('https://github.com/sonicant/tool-nexus-portal/discussions/7', '_blank')}
           className="flex items-center gap-2"
         >
           <ExternalLink className="h-4 w-4" />
           {t('common.suggestNewTool')}
         </Button>
       </div>
       </div>
    </>
  );
};

export default Index;
