import { motion } from "framer-motion";
import { fadeInUpProps } from "@/utils/animations";
import { HeroTitle } from "./HeroTitle";
import { HeroDescription } from "./HeroDescription";
import { HeroButtons } from "./HeroButtons";
import { HeroTrustIndicators } from "./HeroTrustIndicators";

export function HeroContent() {
  return (
    <div className="container px-4 mx-auto relative z-10">
      <motion.div 
        {...fadeInUpProps}
        className="text-center space-y-8 max-w-4xl mx-auto"
      >
        <HeroTitle />
        <HeroDescription />
        <HeroButtons />
        <HeroTrustIndicators />
      </motion.div>
    </div>
  );
}