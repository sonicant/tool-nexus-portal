import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ToolMeta } from '@/types/tool';
import { useI18n } from '@/hooks/useI18n';
import { useFavorites } from '@/hooks/useFavorites';
import { Link } from 'react-router-dom';
import { Hash, Cog, ArrowRightLeft, GitCompare, Network, QrCode, Heart, Link as LinkIcon } from 'lucide-react';

const iconMap = {
  hash: Hash,
  cog: Cog,
  'arrow-right-left': ArrowRightLeft,
  'git-compare': GitCompare,
  network: Network,
  'qr-code': QrCode,
  link: LinkIcon,
};

interface ToolCardProps {
  tool: ToolMeta;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { language } = useI18n();
  const { isFavorite, toggleFavorite } = useFavorites();
  const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Hash;
  const isToolFavorite = isFavorite(tool.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <Link to={tool.path}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-card border-0 shadow-md cursor-pointer relative">
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 z-10 opacity-60 hover:opacity-100 p-1 h-auto"
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={`h-4 w-4 ${isToolFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </Button>
        
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-primary">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 pr-8">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {tool.name[language]}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <HoverCard>
            <HoverCardTrigger asChild>
              <CardDescription className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem] cursor-help">
                {tool.description[language]}
              </CardDescription>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">{tool.description[language]}</p>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>
    </Link>
  );
};