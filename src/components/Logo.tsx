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
          "bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent",
          "transition-all duration-500 hover:scale-105",
          "hover:from-[#D946EF] hover:via-[#8B5CF6] hover:to-[#9b87f5]",
          "drop-shadow-sm",
          textSizes[size]
        )}
      >
        VICTAURE
      </div>
    </div>
  );
}