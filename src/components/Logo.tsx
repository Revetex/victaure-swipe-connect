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
          "relative",
          "transition-all duration-500 hover:scale-105",
          textSizes[size]
        )}
      >
        <span className="absolute inset-0 blur-[1px] text-[#222222]">
          VICTAURE
        </span>
        <span className="relative bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#D4AF37] bg-clip-text text-transparent" style={{
          WebkitTextStroke: '0.5px #222222',
          textShadow: '0 0 1px rgba(34, 34, 34, 0.3)'
        }}>
          VICTAURE
        </span>
      </div>
    </div>
  );
}