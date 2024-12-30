import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn("relative group", className)}>
      <img
        src="/lovable-uploads/465f04b5-cc68-4002-adcc-ccd6492ca572.png"
        alt="Victaure Logo"
        className={cn(
          "transition-all duration-300 group-hover:scale-105",
          sizes[size]
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
    </div>
  );
}