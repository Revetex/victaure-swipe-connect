
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export function ItemsMarket() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Articles à vendre ou louer</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Publier une annonce
        </Button>
      </div>

      {/* Placeholder pour la liste des articles */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">
            Les annonces apparaîtront ici...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
