export interface ToolCategory {
  id: string;
  name: Record<string, string>;
  icon: string;
}

export interface ToolMeta {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  category: string;
  keywords: Record<string, string[]>;
  path: string;
  component: React.ComponentType;
}

export interface ToolModule {
  meta: ToolMeta;
  component: React.ComponentType;
}

export type Language = 'en' | 'zh';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export interface Translations {
  en: TranslationKey;
  zh: TranslationKey;
}