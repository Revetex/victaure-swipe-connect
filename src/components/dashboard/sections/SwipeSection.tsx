import { SwipeJob } from "@/components/SwipeJob";
import { motion } from "framer-motion";

interface SwipeSectionProps {
  variants: any;
}

export function SwipeSection({ variants }: SwipeSectionProps) {
  return (
    <motion.div 
      variants={variants}
      className="col-span-1 md:col-span-1 xl:col-span-2 h-[650px] md:h-[750px]"
    >
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
        <SwipeJob />
      </div>
    </motion.div>
  );
}