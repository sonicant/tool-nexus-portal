import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 首先检查URL参数中的主题设置（来自父项目）
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme') as Theme;
    if (urlTheme && (urlTheme === 'dark' || urlTheme === 'light')) {
      return urlTheme;
    }
    
    // 其次检查本地存储
    const saved = localStorage.getItem('theme');
    if (saved && (saved === 'dark' || saved === 'light')) {
      return saved as Theme;
    }
    
    // 最后使用系统偏好
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return systemPreference;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 监听URL参数变化（当父项目切换主题时）
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 安全检查：确保消息来自可信源
      if (event.origin !== import.meta.env.VITE_PARENT_APP_URL) {
        return;
      }
      
      if (event.data.type === 'THEME_CHANGE' && event.data.theme) {
        const newTheme = event.data.theme as Theme;
        if (newTheme === 'dark' || newTheme === 'light') {
          setTheme(newTheme);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 监听URL参数变化（当用户直接修改URL时）
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get('theme') as Theme;
      if (urlTheme && (urlTheme === 'dark' || urlTheme === 'light')) {
        setTheme(urlTheme);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 监听URL hash变化和手动URL修改
  useEffect(() => {
    const checkUrlTheme = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get('theme') as Theme;
      if (urlTheme && (urlTheme === 'dark' || urlTheme === 'light') && urlTheme !== theme) {
        setTheme(urlTheme);
      }
    };

    // 定期检查URL参数变化（用于处理手动修改地址栏的情况）
    const interval = setInterval(checkUrlTheme, 1000);
    return () => clearInterval(interval);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
};