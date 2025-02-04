import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Briefcase, Users } from "lucide-react";
import { Logo } from "@/components/Logo";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Trouvez votre emploi idéal
              </span>
              <br />
              <span className="text-foreground">au Québec</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              La première plateforme d'emploi qui met en relation les talents et les entreprises de manière intelligente
            </p>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 justify-center"
              >
                <Search className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">Recherche intelligente</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 justify-center"
              >
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">Offres vérifiées</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 justify-center"
              >
                <Users className="h-6 w-6 text-primary" />
                <span className="text-muted-foreground">Communauté active</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}