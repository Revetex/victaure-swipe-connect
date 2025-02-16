
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesList } from "./ServicesList";
import { motion } from "framer-motion";
import { Search, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Marketplace() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container relative py-20 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-medium">Découvrez notre marketplace</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Achetez, vendez, et échangez sur Victaure
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Trouvez des offres intéressantes ou proposez vos services à la communauté Victaure.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <Input
              placeholder="Rechercher dans la marketplace..."
              className="pl-10 pr-4 h-12 bg-background border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <div className="flex items-center justify-between gap-4 mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="marketplace">Vente & Location</TabsTrigger>
              <TabsTrigger value="gigs">Jobines</TabsTrigger>
            </TabsList>

            <Button>
              Publier une annonce
            </Button>
          </div>

          <TabsContent value="services">
            <ServicesList />
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="text-center text-muted-foreground py-12">
              Section en cours de développement
            </div>
          </TabsContent>

          <TabsContent value="gigs">
            <div className="text-center text-muted-foreground py-12">
              Section en cours de développement
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
