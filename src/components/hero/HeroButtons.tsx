import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="lg"
          onClick={() => navigate("/auth?mode=signin")}
          className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          Commencer maintenant
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          size="lg"
          onClick={() => navigate("/auth?mode=signup")}
          variant="outline"
          className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Pour les entreprises
        </Button>
      </motion.div>
    </div>
  );
}