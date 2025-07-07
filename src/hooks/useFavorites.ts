import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  toggleFavorite: (toolId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const useFavoritesProvider = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('it-tools-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  const addFavorite = (toolId: string) => {
    setFavorites(prev => {
      if (!prev.includes(toolId)) {
        const newFavorites = [...prev, toolId];
        localStorage.setItem('it-tools-favorites', JSON.stringify(newFavorites));
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFavorite = (toolId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== toolId);
      localStorage.setItem('it-tools-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (toolId: string) => {
    return favorites.includes(toolId);
  };

  const toggleFavorite = (toolId: string) => {
    if (isFavorite(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const favoritesState = useFavoritesProvider();

  return (
    <FavoritesContext.Provider value={favoritesState}>
      {children}
    </FavoritesContext.Provider>
  );
};