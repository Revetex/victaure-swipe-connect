import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Enhanced animated background grid */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      {/* Enhanced animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#8B5CF6,transparent)]"
        />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0, 1, 0],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
          />
        ))}
      </div>

      {/* Enhanced Content */}
      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="xl" className="mx-auto" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent font-playfair"
          >
            Votre Carrière, Notre Mission
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-montserrat leading-relaxed"
          >
            Découvrez la puissance de l'intelligence artificielle pour votre recherche d'emploi. 
            Notre assistant IA révolutionne votre parcours professionnel avec des opportunités 
            sur mesure et un accompagnement personnalisé.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth">
              <Button 
                size="lg" 
                className="font-montserrat group relative overflow-hidden bg-[#9b87f5] hover:bg-[#8B5CF6] px-8 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center">
                  Commencer maintenant
                  <Sparkles className="ml-2 h-5 w-5 animate-pulse" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7E69AB]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>

            <Link to="/auth">
              <Button 
                variant="outline"
                size="lg" 
                className="font-montserrat group relative overflow-hidden border-purple-400 text-primary hover:text-primary/90 px-8 py-6 text-lg"
              >
                Découvrir les offres
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-muted-foreground">Protection des données</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              <span className="text-muted-foreground">+10,000 utilisateurs satisfaits</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="text-muted-foreground">IA de dernière génération</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced decorative blur effects */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"
      />
    </section>
  );
}