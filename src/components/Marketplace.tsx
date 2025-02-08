
import { ExternalSearchSection } from "@/components/jobs/sections/ExternalSearchSection";
import { useJobFilters } from "@/hooks/useJobFilters";
import { motion } from "framer-motion";

export function Marketplace() {
  const { filters, updateFilter } = useJobFilters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 py-16"
      >
        <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-pink-600 font-montserrat mb-6">
          Trouvez votre prochaine opportunité
        </h1>
        <p className="text-xl text-gray-400 font-inter max-w-2xl mx-auto px-4">
          Notre marketplace intelligent met en relation les meilleurs talents avec les entreprises les plus innovantes. Découvrez des opportunités uniques, parfaitement adaptées à vos compétences.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-[#9b87f5]"
          >
            <div className="w-3 h-3 rounded-full bg-[#9b87f5]" />
            <span>Matching IA</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-[#9b87f5]"
          >
            <div className="w-3 h-3 rounded-full bg-[#9b87f5]" />
            <span>Opportunités vérifiées</span>
          </motion.div>
        </div>
      </motion.div>

      <ExternalSearchSection 
        filters={filters}
        onFilterChange={updateFilter}
      />
    </div>
  );
}
