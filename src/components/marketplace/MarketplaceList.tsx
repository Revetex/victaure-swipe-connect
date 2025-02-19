
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  MapPin, 
  DollarSign,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceListing } from "@/types/marketplace";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MarketplaceListProps {
  type: "all" | "vente" | "location" | "service";
  searchQuery: string;
}

export function MarketplaceList({ type, searchQuery }: MarketplaceListProps) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchListings();
  }, [type, searchQuery]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          seller:seller_id (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (type !== "all") {
        query = query.eq('type', type);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune annonce trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-video">
            {listing.images?.[0] && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              onClick={() => toggleFavorite(listing.id)}
            >
              <Heart className={`h-5 w-5 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold truncate">{listing.title}</h3>
              <Badge variant="outline" className={`
                ${type === 'vente' ? 'text-green-500' : ''}
                ${type === 'location' ? 'text-blue-500' : ''}
                ${type === 'service' ? 'text-purple-500' : ''}
              `}>
                {listing.type}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(listing.created_at).toLocaleDateString('fr-CA', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              {listing.seller?.full_name && (
                <>
                  <span>•</span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={listing.seller.avatar_url || ''} />
                    <AvatarFallback>
                      {listing.seller.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{listing.seller.full_name}</span>
                </>
              )}
            </div>

            {listing.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {listing.description}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <p className="font-semibold flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {listing.price} {listing.currency}
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
