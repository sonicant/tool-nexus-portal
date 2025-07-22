import { cn } from "@/lib/utils";
import toolIcon from "@/assets/tool-nexus-icon.png";

interface ToolIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
}

export function ToolIcon({ className, size = "md", alt = "Tool Icon" }: ToolIconProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <img 
      src={toolIcon}
      alt={alt}
      className={cn("rounded object-contain", sizeClasses[size], className)}
      loading="lazy"
      decoding="async"
    />
  );
}