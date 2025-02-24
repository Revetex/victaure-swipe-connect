
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from 'framer-motion';

interface SubmitButtonProps {
  loading: boolean;
  disabled?: boolean;
}

export function SubmitButton({ loading, disabled }: SubmitButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <Button
        type="submit"
        className="w-full bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white transition-all duration-300"
        disabled={loading || disabled}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer mon compte entreprise"
        )}
      </Button>
      <p className="text-sm text-[#F1F0FB]/60 text-center mt-4">
        Merci de votre confiance
      </p>
    </motion.div>
  );
}
