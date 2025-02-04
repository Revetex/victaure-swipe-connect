import { Features } from "@/components/Features";
import { motion } from "framer-motion";

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] dark:from-[#D6BCFA] dark:to-[#7E69AB]">
          Pourquoi choisir Victaure ?
        </h2>
        <Features />
      </motion.div>
    </section>
  );
}