
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function RegularJobs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Offres d'emploi</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Publier une offre
        </Button>
      </div>

      {/* Placeholder pour la liste des emplois */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">
            Les offres d'emploi apparaîtront ici...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
