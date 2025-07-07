import { Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import { categories, getToolsByCategory } from '@/registry/toolRegistry';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Hash, Cog, ArrowRightLeft, GitCompare, Network } from 'lucide-react';

const iconMap = {
  hash: Hash,
  cog: Cog,
  'arrow-right-left': ArrowRightLeft,
  'git-compare': GitCompare,
  network: Network,
};

export const AppSidebar = () => {
  const { language } = useI18n();
  const location = useLocation();
  const { state } = useSidebar();
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/">
                <Home className="h-6 w-6" />
                <span className="text-lg font-bold">IT Tools</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {categories.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Hash;
          
          if (categoryTools.length === 0) return null;
          
          return (
            <Collapsible key={category.id} defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center gap-2 p-2 hover:bg-sidebar-accent rounded-md">
                    <IconComponent className="h-4 w-4" />
                    {state !== "collapsed" && (
                      <>
                        <span className="flex-1 text-left">{category.name[language]}</span>
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                      </>
                    )}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {categoryTools.map((tool) => {
                        const ToolIcon = iconMap[tool.icon as keyof typeof iconMap] || Hash;
                        const isActive = location.pathname === tool.path;
                        
                        return (
                          <SidebarMenuItem key={tool.id}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={isActive}
                              tooltip={state === "collapsed" ? tool.name[language] : undefined}
                            >
                              <Link to={tool.path}>
                                <ToolIcon className="h-4 w-4" />
                                <span>{tool.name[language]}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};