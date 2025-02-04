import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
    xl: "h-16",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
        alt="Victaure Logo" 
        className={cn(sizes[size])}
      />
      {showText && (
        <div className={cn("font-bold text-primary", textSizes[size])}>
          VICTAURE
        </div>
      )}
    </div>
  );
}