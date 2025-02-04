import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function CTASection() {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Prêt à Booster Votre Carrière ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez Victaure aujourd'hui et accédez à des opportunités professionnelles uniques.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] dark:bg-[#D6BCFA] dark:hover:bg-[#7E69AB] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Créer Mon Compte
          </Button>
        </motion.div>
      </div>
    </section>
  );
}