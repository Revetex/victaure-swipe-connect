import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <Hero />
      <Features />
      <Stats />
      
      {/* Floating Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <Button
          size="lg"
          onClick={() => navigate("/marketplace")}
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 flex items-center gap-2"
        >
          <Briefcase className="h-5 w-5" />
          Voir les offres d'emploi
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}