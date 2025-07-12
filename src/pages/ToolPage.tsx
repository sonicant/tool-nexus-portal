import { useParams } from 'react-router-dom';
import { getToolById } from '@/registry/toolRegistry';
import { useI18n } from '@/hooks/useI18n';
import SEOHead from '@/components/seo/SEOHead';
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
      <ToolComponent />
    </>
  );
};

export default ToolPage;