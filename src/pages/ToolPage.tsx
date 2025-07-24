import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { getToolById } from '@/registry/toolRegistry';
import { useI18n } from '@/hooks/useI18n';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import NotFound from './NotFound';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { language } = useI18n();
  
  if (!toolId) {
    return <NotFound />;
  }

  const tool = getToolById(toolId);
  
  if (!tool) {
    return <NotFound />;
  }

  const ToolComponent = tool.component;
  
  return (
    <>
      <SEOHead toolId={toolId} />
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb />
        <Suspense fallback={
          <LoadingSpinner 
            size="lg" 
            text={`Loading ${tool.name?.en || tool.id}...`}
            className="min-h-[400px]"
          />
        }>
          <ToolComponent />
        </Suspense>
      </div>
    </>
  );
};

export default ToolPage;