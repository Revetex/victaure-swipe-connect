import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        className={cn(
          "font-playfair font-bold tracking-wider",
          "bg-gradient-to-r from-primary via-purple-600 to-violet-600 bg-clip-text text-transparent",
          "transition-all duration-500 hover:scale-105",
          "hover:from-violet-600 hover:via-purple-600 hover:to-primary",
          "drop-shadow-sm",
          textSizes[size]
        )}
      >
        VICTAURE
      </div>
    </div>
  );
}