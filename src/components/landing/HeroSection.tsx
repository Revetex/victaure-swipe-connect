import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Votre Carrière, Notre Mission
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez des opportunités professionnelles uniques et construisez votre avenir avec Victaure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth?mode=signin")}
                className="bg-[#9b87f5] hover:bg-[#7E69AB] dark:bg-[#D6BCFA] dark:hover:bg-[#7E69AB] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Connexion
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/auth?mode=signup")}
                className="bg-white/10 hover:bg-white/20 text-primary border border-primary px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Inscription
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}