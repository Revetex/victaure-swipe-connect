import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";

interface VCardSectionProps {
  variants: any;
}

export function VCardSection({ variants }: VCardSectionProps) {
  return (
    <motion.div 
      variants={variants}
      className="col-span-1 md:col-span-2 xl:col-span-4 min-h-[650px] md:min-h-[750px]"
    >
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 overflow-auto">
        <div className="p-6 sm:p-8">
          <VCard />
        </div>
      </div>
    </motion.div>
  );
}