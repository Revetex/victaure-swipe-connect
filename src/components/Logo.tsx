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
          "font-inter font-bold tracking-tight",
          "relative",
          "transition-all duration-500 hover:scale-105",
          textSizes[size]
        )}
      >
        <span className="relative bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          VICTAURE
        </span>
      </div>
    </div>
  );
}