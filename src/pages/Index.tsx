
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5]/5 via-[#D6BCFA]/5 to-[#403E43]/5">
      <div className="fixed inset-0 bg-grid-white/10 bg-grid-16 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <header className="px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img 
                src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
                alt="Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-[#D6BCFA] text-transparent bg-clip-text"
            >
              Votre Assistant IA Personnel
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-xl text-muted-foreground"
            >
              Découvrez une nouvelle façon de gérer votre carrière avec l'aide de l'intelligence artificielle
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/auth?signup=true">
                <Button size="lg" className="group">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <video
              autoPlay
              muted
              loop
              className="w-full h-auto rounded-2xl shadow-2xl"
            >
              <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </motion.div>
        </main>

        <footer className="mt-32 py-12 bg-background/80 backdrop-blur-sm border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2024 Victaure. Tous droits réservés.</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
