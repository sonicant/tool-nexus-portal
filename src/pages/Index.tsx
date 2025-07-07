import { useI18n } from '@/hooks/useI18n';
import { tools } from '@/registry/toolRegistry';
import { ToolCard } from '@/components/layout/ToolCard';

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          {t('common.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('common.description')}
        </p>
      </div>

      {/* All Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default Index;
