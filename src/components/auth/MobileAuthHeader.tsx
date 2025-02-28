
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function MobileAuthHeader() {
  // Fonction pour vérifier si on est sur mobile
  const isMobile = window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Ne rien afficher si on n'est pas sur mobile
  if (!isMobile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 mb-4"
    >
      <div className="flex items-center space-x-2">
        <div className="text-xl font-semibold text-white">Connexion mobile</div>
      </div>
      <p className="text-sm text-white/70 mt-1">
        Authentifiez-vous pour accéder à votre compte
      </p>
    </motion.div>
  );
}
