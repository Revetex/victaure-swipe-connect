
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegularJobs } from "./marketplace/RegularJobs";
import { ItemsMarket } from "./marketplace/ItemsMarket";
import { ServicesMarket } from "./marketplace/ServicesMarket";
import { Package, Briefcase, HandshakeIcon } from "lucide-react";

export function Marketplace() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container relative py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Votre place de marché{" "}
              <span className="text-primary">tout-en-un</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Trouvez des offres uniques, des services professionnels et des opportunités d'emploi
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Acheter/Vendre</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Emplois</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <HandshakeIcon className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <ItemsMarket />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <RegularJobs />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <ServicesMarket />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
