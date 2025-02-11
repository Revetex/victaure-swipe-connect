
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Gavel } from "lucide-react";

export function ServicesMarket() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Services & Enchères</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Gavel className="h-4 w-4 mr-2" />
            Enchères actives
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Proposer un service
          </Button>
        </div>
      </div>

      {/* Placeholder pour la liste des services */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">
            Les services et enchères apparaîtront ici...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
