import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { HeroFeatures } from "./HeroFeatures";
import { HeroVideo } from "./HeroVideo";
import { HeroButtons } from "./HeroButtons";

export function HeroSection() {
  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-background via-purple-900/10 to-background">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#8B5CF6,transparent)]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex justify-center mb-12">
          <Logo size="xl" className="mt-8 sm:mt-12 md:mt-16" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent"
              >
                L'IA au Service de Votre Succès
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-foreground"
              >
                Premier Écosystème Digital Intelligent
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Découvrez une plateforme révolutionnaire où l'IA optimise chaque aspect de votre activité : 
              réseaux sociaux, services professionnels et orientation stratégique.
            </motion.p>

            <HeroButtons />

            <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <HeroFeatures />
              <HeroVideo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}