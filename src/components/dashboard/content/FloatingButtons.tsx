
import { motion } from "framer-motion";
import { Sparkles, Radio, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FloatingButtons() {
  const handleSparklesClick = () => {
    toast.info("Fonctionnalité à venir !");
  };

  const handleRadioClick = () => {
    toast.info("Fonctionnalité à venir !");
  };

  const handleZapClick = () => {
    toast.info("Fonctionnalité à venir !");
  };

  return (
    <motion.div
      variants={{ 
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      initial="initial"
      animate="animate"
      className="fixed bottom-8 right-8 flex gap-4"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSparklesClick}
        className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Sparkles className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRadioClick}
        className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Radio className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleZapClick}
        className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Zap className="w-6 h-6" />
      </Button>
    </motion.div>
  );
}
