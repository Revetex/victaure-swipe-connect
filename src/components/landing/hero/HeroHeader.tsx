
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export function HeroHeader() {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <div className="flex justify-center mb-12">
        <Logo size="xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signin")}
            className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Pour les entreprises
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
