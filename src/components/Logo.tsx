import { cn } from "@/lib/utils";
import { Image } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fallback?: boolean;
}

export function Logo({ className, size = "md", fallback = false }: LogoProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const logoUrl = "/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png";

  if (fallback) {
    return <Image className={cn(sizes[size], "text-primary")} />;
  }

  return (
    <div className={cn("relative group", className)}>
      <img
        src={logoUrl}
        alt="Victaure Logo"
        className={cn(
          "transition-all duration-300 group-hover:scale-105",
          sizes[size]
        )}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          console.error("Error loading logo:", target.src);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
    </div>
  );
}