import { motion } from "framer-motion";
import { fadeInUpProps } from "@/utils/animations";

export function HeroDescription() {
  return (
    <motion.p 
      {...fadeInUpProps}
      className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-montserrat leading-relaxed"
    >
      Victaure transforme le processus de recrutement grâce à l'intelligence artificielle. 
      Notre technologie de pointe analyse, correspond et connecte les meilleurs talents 
      aux opportunités parfaites, créant des connexions professionnelles qui durent.
    </motion.p>
  );
}