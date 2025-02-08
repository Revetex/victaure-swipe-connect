
import { ExternalSearchSection } from "@/components/jobs/sections/ExternalSearchSection";
import { useJobFilters } from "@/hooks/useJobFilters";
import { motion } from "framer-motion";

export function Marketplace() {
  const { filters, updateFilter } = useJobFilters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-montserrat mb-2">
            Marketplace des Talents
          </h1>
          <p className="text-gray-400 font-inter">
            Trouvez votre prochaine opportunité professionnelle
          </p>
        </motion.div>

        <ExternalSearchSection 
          filters={filters}
          onFilterChange={updateFilter}
        />
      </div>
    </div>
  );
}
