import { Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/hooks/useI18n';

export const PrivacyNotice = () => {
  const { t } = useI18n();

  return (
    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <span className="font-medium">{t('common.privacyNotice')}:</span>{' '}
        {t('common.privacyDescription')}
      </AlertDescription>
    </Alert>
  );
};