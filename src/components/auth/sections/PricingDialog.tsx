
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PricingDialogProps {
  isPricingOpen: boolean;
  setIsPricingOpen: (open: boolean) => void;
}

export function PricingDialog({ isPricingOpen, setIsPricingOpen }: PricingDialogProps) {
  return (
    <>
      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <DialogContent className="max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#64B5D9]/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white mb-6">
              Tarifs Victaure 2024
            </DialogTitle>
          </DialogHeader>
          <PricingGrid />
        </DialogContent>
      </Dialog>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <button
          onClick={() => setIsPricingOpen(true)}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] px-6 py-3 transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-white/20 transition-transform duration-300 group-hover:translate-x-full" />
          <span className="relative flex items-center gap-2 text-white font-medium">
            Voir tous nos tarifs
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </motion.div>
    </>
  );
}
