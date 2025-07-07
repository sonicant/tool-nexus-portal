import { useParams } from 'react-router-dom';
import { getToolById } from '@/registry/toolRegistry';
import { useI18n } from '@/hooks/useI18n';
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
  
  return <ToolComponent />;
};

export default ToolPage;