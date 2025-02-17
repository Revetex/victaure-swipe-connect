
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export function HeroHeader() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        role="banner"
      >
        <Logo size="xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          style={{ textWrap: "balance" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 dark:from-purple-400 dark:via-purple-500 dark:to-purple-400 bg-clip-text text-transparent"
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
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          style={{ textWrap: "balance" }}
        >
          Découvrez une plateforme révolutionnaire où l'IA optimise chaque aspect de votre activité : 
          réseaux sociaux, services professionnels et orientation stratégique.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signin")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            aria-label="Commencer avec Victaure"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            aria-label="Accéder à l'espace entreprise"
          >
            Pour les entreprises
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
