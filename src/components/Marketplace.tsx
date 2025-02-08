
import { Card } from "@/components/ui/card";
import { ExternalSearchSection } from "@/components/google-search/ExternalSearchSection";
import { SwipeJob } from "@/components/SwipeJob";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Marketplace() {
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

        <Tabs defaultValue="swipe" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-800/50 backdrop-blur-lg p-1 rounded-xl">
            <TabsTrigger 
              value="swipe" 
              className="font-inter flex items-center gap-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all duration-300"
            >
              <BadgeCheck className="h-4 w-4" />
              Offres Victaure
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="font-inter flex items-center gap-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              Recherche externe
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="swipe" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
                  <SwipeJob />
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="search" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
                  <ExternalSearchSection />
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
