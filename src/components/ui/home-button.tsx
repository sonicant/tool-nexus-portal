import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';

export const HomeButton = () => {
  const { t } = useI18n();
  
  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/" className="flex items-center gap-2">
        <Home className="h-4 w-4" />
        {t('common.home')}
      </Link>
    </Button>
  );
};