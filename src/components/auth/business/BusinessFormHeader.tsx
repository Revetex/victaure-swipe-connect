
import React from 'react';
import { motion } from 'framer-motion';

export function BusinessFormHeader() {
  return (
    <motion.div 
      className="space-y-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold tracking-tight">
        Créez votre compte entreprise
      </h1>
      <p className="text-muted-foreground">
        Commencez à publier vos offres d'emploi et trouvez les meilleurs talents
      </p>
    </motion.div>
  );
}
