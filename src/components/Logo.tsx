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
    <div className={cn("flex items-center justify-center mt-8 sm:mt-12 md:mt-16", className)}>
      <div className={cn("font-bold text-primary tracking-wider", textSizes[size])}>
        VICTAURE
      </div>
    </div>
  );
}