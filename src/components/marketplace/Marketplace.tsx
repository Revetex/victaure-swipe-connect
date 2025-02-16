
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesList } from "./ServicesList";
import { motion } from "framer-motion";
import { Search, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGigs } from "@/hooks/useGigs";
import { useMarketplace } from "@/hooks/useMarketplace";
import { PageLayout } from "@/components/layout/PageLayout";

export function Marketplace() {
  const { gigs, isLoading: gigsLoading } = useGigs();
  const { listings, isLoading: listingsLoading } = useMarketplace();

  console.log("Gigs:", gigs);
  console.log("Listings:", listings);

  return (
    <PageLayout>
      <div className="container py-6 space-y-8">
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
            {listingsLoading ? (
              <div className="text-center text-muted-foreground py-12">
                Chargement...
              </div>
            ) : !listings?.length ? (
              <div className="text-center text-muted-foreground py-12">
                Aucune annonce disponible
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{listing.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-primary font-medium">{listing.price} {listing.currency}</span>
                      <span className="text-sm text-muted-foreground">
                        Par {listing.seller?.full_name || 'Anonyme'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="gigs">
            {gigsLoading ? (
              <div className="text-center text-muted-foreground py-12">
                Chargement...
              </div>
            ) : !gigs?.length ? (
              <div className="text-center text-muted-foreground py-12">
                Aucune jobine disponible
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <div key={gig.id} className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border">
                    <h3 className="font-semibold">{gig.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{gig.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-primary font-medium">{gig.budget} CAD</span>
                      <span className="text-sm text-muted-foreground">
                        Par {gig.creator?.full_name || 'Anonyme'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
