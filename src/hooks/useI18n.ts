import { useContext, createContext, useState, useEffect } from 'react';
import { Language, TranslationKey } from '@/types/tool';
import { translations } from '@/i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const useI18nProvider = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'zh' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const getNestedValue = (obj: TranslationKey, path: string[]): string => {
    let current: any = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return path.join('.');
      }
    }
    return typeof current === 'string' ? current : path.join('.');
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let result = getNestedValue(translations[language], keys);
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        result = result.replace(`{{${param}}}`, value);
      });
    }
    
    return result;
  };

  return { language, setLanguage, t };
};