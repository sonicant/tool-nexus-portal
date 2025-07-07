import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToolMeta } from '@/types/tool';
import { useI18n } from '@/hooks/useI18n';
import { Link } from 'react-router-dom';
import { Hash, Cog, ArrowRightLeft, GitCompare, Network, QrCode } from 'lucide-react';

const iconMap = {
  hash: Hash,
  cog: Cog,
  'arrow-right-left': ArrowRightLeft,
  'git-compare': GitCompare,
  network: Network,
  'qr-code': QrCode,
};

interface ToolCardProps {
  tool: ToolMeta;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { language } = useI18n();
  const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Hash;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-card border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-primary">
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {tool.name[language]}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {tool.description[language]}
        </CardDescription>
        <Button 
          asChild 
          variant="gradient" 
          size="sm" 
          className="w-full"
        >
          <Link to={tool.path}>
            Open Tool
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};