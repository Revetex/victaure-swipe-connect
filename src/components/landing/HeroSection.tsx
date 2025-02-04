import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Briefcase, Users, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-background via-purple-900/10 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#8B5CF6,transparent)]"
        />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{ 
              opacity: [0, 1, 0],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
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

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex justify-center mb-12">
          <Logo size="xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  icon: Search,
                  text: "IA Prédictive Avancée"
                },
                {
                  icon: Briefcase,
                  text: "Services Intelligents"
                },
                {
                  icon: Users,
                  text: "Communauté Active"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 justify-center"
                >
                  <feature.icon className="h-6 w-6 text-[#8B5CF6]" />
                  <span className="text-muted-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Signals Section with Video */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="text-center md:text-left mb-12">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-4"
                >
                  Ils nous font confiance
                </motion.h2>
              </div>
              
              <div className="space-y-6">
                {[
                  "Processus de recrutement simplifié et efficace",
                  "Support réactif et professionnel",
                  "Matching précis entre candidats et emplois",
                  "Protection des données garantie"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-xl"
              >
                <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute inset-0 bg-[#9b87f5]/5 dark:bg-[#D6BCFA]/5 transform -skew-y-3" />
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <DownloadApp />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
