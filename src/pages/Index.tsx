import { useI18n } from '@/hooks/useI18n';
import { categories, tools, getToolsByCategory } from '@/registry/toolRegistry';
import { CategorySection } from '@/components/layout/CategorySection';

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

      {/* Tools by Category */}
      <div className="space-y-16">
        {categories.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          return (
            <CategorySection
              key={category.id}
              category={category}
              tools={categoryTools}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Index;
