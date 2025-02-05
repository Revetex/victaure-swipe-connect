import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeInUpProps, buttonHoverProps } from "@/utils/animations";

export function HeroButtons() {
  return (
    <motion.div 
      {...fadeInUpProps}
      className="flex flex-col sm:flex-row gap-4 justify-center items-center"
    >
      <Link to="/auth">
        <Button 
          size="lg" 
          className="w-full sm:w-auto font-montserrat group relative overflow-hidden bg-[#9b87f5] hover:bg-[#8B5CF6] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-500"
        >
          <motion.span 
            {...buttonHoverProps}
            className="relative z-10 flex items-center whitespace-nowrap"
          >
            Commencer maintenant
            <Sparkles className="ml-2 h-5 w-5" />
          </motion.span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7E69AB]"
            initial={{ x: "100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4 }}
          />
        </Button>
      </Link>

      <Link to="/auth">
        <Button 
          variant="outline"
          size="lg" 
          className="w-full sm:w-auto font-montserrat group relative overflow-hidden border-[#9b87f5] text-primary hover:text-primary/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg backdrop-blur-sm bg-white/5"
        >
          <motion.span
            {...buttonHoverProps}
            className="flex items-center whitespace-nowrap"
          >
            Explorer les opportunités
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.span>
        </Button>
      </Link>
    </motion.div>
  );
}