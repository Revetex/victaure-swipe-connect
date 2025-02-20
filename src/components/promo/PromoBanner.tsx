
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star } from "lucide-react";

interface PromoBannerProps {
  title: string;
  description: string;
  ctaText: string;
  onAction?: () => void;
  variant?: "default" | "premium";
}

export function PromoBanner({ 
  title, 
  description, 
  ctaText, 
  onAction,
  variant = "default" 
}: PromoBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-lg border
        ${variant === "premium" 
          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20" 
          : "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          shrink-0 p-2 rounded-lg
          ${variant === "premium" ? "bg-yellow-500/20" : "bg-primary/20"}
        `}>
          {variant === "premium" ? (
            <Crown className="h-5 w-5 text-yellow-500" />
          ) : (
            <Star className="h-5 w-5 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{title}</h3>
            {variant === "premium" && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Premium
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <Button 
            onClick={onAction}
            variant={variant === "premium" ? "outline" : "default"}
            className={variant === "premium" ? "border-yellow-500/20 hover:bg-yellow-500/20" : ""}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
