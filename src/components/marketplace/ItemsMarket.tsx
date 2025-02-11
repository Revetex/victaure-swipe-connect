import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ImagePlus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Item = Database["public"]["Tables"]["marketplace_items"]["Row"];
type Category = Database["public"]["Tables"]["marketplace_categories"]["Row"];

export function ItemsMarket() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          seller:profiles!marketplace_items_seller_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des articles");
        throw error;
      }

      return data as (Item & { seller: { full_name: string; avatar_url: string | null } })[];
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .eq('type', 'item');

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
        <h2 className="text-2xl font-semibold">Articles à vendre ou louer</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Publier une annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publier une annonce</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input id="title" placeholder="Nom de l'article" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix</Label>
                    <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" />
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
                    <Label htmlFor="condition">État</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="État de l'article" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Neuf</SelectItem>
                        <SelectItem value="like_new">Comme neuf</SelectItem>
                        <SelectItem value="good">Bon état</SelectItem>
                        <SelectItem value="fair">État correct</SelectItem>
                        <SelectItem value="poor">État moyen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre article..."
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
                Publier l'annonce
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
        ) : items.length > 0 ? (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.images && item.images[0] ? (
                <div className="aspect-video relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-lg font-bold text-primary">{item.price} $</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">
              Aucune annonce pour le moment
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
