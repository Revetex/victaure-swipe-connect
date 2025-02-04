import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="text-center pt-8">
        <div className="flex justify-center mb-4">
          <Logo size="lg" showText={false} className="scale-150" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#9b87f5] dark:text-[#D6BCFA]">VICTAURE</h1>
      </div>

      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                Votre Carrière, <br/>
                <span className="text-[#9b87f5] dark:text-[#D6BCFA]">Notre Mission</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
                Trouvez les meilleures opportunités professionnelles grâce à notre plateforme alimentée par l'intelligence artificielle.
              </p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#7E69AB] dark:bg-[#D6BCFA] dark:hover:bg-[#7E69AB] text-white px-8"
                >
                  Commencer Maintenant
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth?mode=signup")}
                  className="w-full sm:w-auto border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10 dark:border-[#D6BCFA] dark:text-[#D6BCFA] dark:hover:bg-[#D6BCFA]/10"
                >
                  Inscription
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative rounded-xl overflow-hidden shadow-2xl mt-8 sm:mt-0"
            >
              <video
                controls
                playsInline
                className="w-full h-full object-cover rounded-xl"
              >
                <source src="/lovable-uploads/victaurepub.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}