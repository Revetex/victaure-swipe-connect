import { motion } from "framer-motion";
import { fadeInUpProps, scaleInProps } from "@/utils/animations";
import { Logo } from "@/components/Logo";

export function HeroTitle() {
  return (
    <>
      <motion.div {...scaleInProps}>
        <Logo size="xl" className="mx-auto" />
      </motion.div>
      
      <motion.h1 
        {...scaleInProps}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#D6BCFA] bg-clip-text text-transparent font-playfair"
      >
        L'IA qui Révolutionne le Recrutement
      </motion.h1>
    </>
  );
}