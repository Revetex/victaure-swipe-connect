import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, Gavel, ImagePlus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["marketplace_services"]["Row"];
type Category = Database["public"]["Tables"]["marketplace_categories"]["Row"];
type ServiceWithDetails = Service & {
  provider: { full_name: string; avatar_url: string | null };
  bids: { count: number }[];
};

export function ServicesMarket() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['marketplace-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_services')
        .select(`
          *,
          provider:profiles!marketplace_services_provider_id_fkey(
            full_name,
            avatar_url
          ),
          bids:service_bids(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des services");
        throw error;
      }

      return data as ServiceWithDetails[];
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['marketplace-service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .eq('type', 'service');

      if (error) {
        toast.error("Erreur lors du chargement des catégories");
        throw error;
      }

      return data as Category[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Services & Enchères</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Gavel className="h-4 w-4 mr-2" />
            Enchères actives
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Proposer un service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Proposer un service</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input id="title" placeholder="Nom du service" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Type de service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed_price">Prix fixe</SelectItem>
                          <SelectItem value="auction">Enchère</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix de départ</Label>
                      <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre service..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Photos</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                        >
                          <ImagePlus className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  Publier le service
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4 space-y-4">
              <div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              </div>
            </Card>
          ))
        ) : services.length > 0 ? (
          services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              {service.images && service.images[0] ? (
                <div className="aspect-video relative">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{service.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    {service.current_price || service.price} $
                  </p>
                  {service.type === 'auction' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(service.auction_end_date).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                {service.type === 'auction' && (
                  <p className="text-sm text-muted-foreground">
                    {service.bids[0].count} enchère(s)
                  </p>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">
              Aucun service disponible pour le moment
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
