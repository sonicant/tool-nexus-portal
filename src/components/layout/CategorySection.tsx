import { ToolCategory, ToolMeta } from '@/types/tool';
import { useI18n } from '@/hooks/useI18n';
import { ToolCard } from './ToolCard';
import { Hash, Cog, ArrowRightLeft, GitCompare, Network, QrCode, Heart, Link as LinkIcon, Globe, ChartLine, FileCheck, Database, Send, Clock } from 'lucide-react';

const iconMap = {
  hash: Hash,
  cog: Cog,
  'arrow-right-left': ArrowRightLeft,
  'git-compare': GitCompare,
  network: Network,
  'qr-code': QrCode,
  link: LinkIcon,
  globe: Globe,
  'chart-line': ChartLine,
  'file-check': FileCheck,
  database: Database,
  send: Send,
  clock: Clock,
};

interface CategorySectionProps {
  category: ToolCategory;
  tools: ToolMeta[];
}

export const CategorySection = ({ category, tools }: CategorySectionProps) => {
  const { language } = useI18n();
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Hash;

  if (tools.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-primary rounded-lg shadow-primary">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {category.name[language]}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};