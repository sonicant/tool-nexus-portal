import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { useThemeContext } from '@/components/ui/theme-provider';
import { Moon, Sun, Languages, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">IT</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('common.title')}
            </h1>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            title={t('common.toggleLanguage')}
          >
            <Languages className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={t('common.toggleTheme')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href="https://github.com/your-repo/it-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.github')}</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};