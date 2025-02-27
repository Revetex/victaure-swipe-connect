
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserAvatar } from "@/components/UserAvatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceListing } from "@/types/marketplace";

interface CustomListingsProps {
  items: MarketplaceListing[];
  isLoading?: boolean;
}

export function CustomListings({ items, isLoading = false }: CustomListingsProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [savingFavorite, setSavingFavorite] = useState<string | null>(null);

  // Load favorites for the current user
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("marketplace_favorites")
          .select("item_id")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data) {
          const favMap: Record<string, boolean> = {};
          data.forEach(fav => {
            if (fav.item_id) {
              favMap[fav.item_id] = true;
            }
          });
          setFavorites(favMap);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (itemId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter des favoris");
      return;
    }

    setSavingFavorite(itemId);

    try {
      const isFavorite = favorites[itemId];

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("marketplace_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", itemId);

        if (error) throw error;

        setFavorites(prev => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });

        toast.success("Retiré des favoris");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("marketplace_favorites")
          .insert({
            user_id: user.id,
            item_id: itemId
          });

        if (error) throw error;

        setFavorites(prev => ({ ...prev, [itemId]: true }));
        toast.success("Ajouté aux favoris");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setSavingFavorite(null);
    }
  };

  const incrementViews = async (itemId: string) => {
    if (!user) return;

    try {
      // Insertion dans la table marketplace_views
      await supabase
        .from('marketplace_views')
        .insert({ 
          item_id: itemId,
          user_id: user.id
        });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Aucune annonce trouvée</h3>
        <p className="text-muted-foreground">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
          onClick={() => incrementViews(item.id)}
        >
          <div className="aspect-video relative overflow-hidden bg-muted">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Pas d'image
              </div>
            )}
            {item.type && (
              <Badge
                className="absolute top-2 right-2 bg-primary"
                variant="default"
              >
                {item.type === "vente"
                  ? "À vendre"
                  : item.type === "location"
                  ? "À louer"
                  : "Service"}
              </Badge>
            )}
          </div>

          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg line-clamp-1">{item.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  favorites[item.id] &&
                    "text-red-500 hover:text-red-600 hover:bg-red-50"
                )}
                disabled={savingFavorite === item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    favorites[item.id] && "fill-current"
                  )}
                />
                <span className="sr-only">
                  {favorites[item.id] ? "Retirer des favoris" : "Ajouter aux favoris"}
                </span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <p className="text-xl font-semibold">
              {item.price.toLocaleString()} {item.currency}
            </p>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
              {item.description}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {item.seller && (
                <>
                  <UserAvatar
                    user={{
                      id: item.seller_id,
                      name: item.seller.full_name,
                      image: item.seller.avatar_url,
                    }}
                    className="h-6 w-6"
                    fallbackClassName="text-xs"
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.seller.full_name}
                  </span>
                </>
              )}
            </div>

            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info("Fonctionnalité à venir");
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Contacter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/marketplace/${item.id}`
                  );
                  toast.success("Lien copié !");
                }}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Partager</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
