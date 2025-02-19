
import { useEffect, useState, useMemo } from "react";
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
  Loader2,
  Eye,
  Star,
  Image
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceListing } from "@/types/marketplace";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketplaceListProps {
  type: "all" | "vente" | "location" | "service";
  searchQuery: string;
}

export function MarketplaceList({ type, searchQuery }: MarketplaceListProps) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [views, setViews] = useState<Record<string, number>>({});
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
            avatar_url,
            rating
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
      
      // Type assertion to ensure data matches MarketplaceListing[]
      const typedData = data as unknown as MarketplaceListing[];
      setListings(typedData);

      // Simuler des vues aléatoires pour la démo
      const randomViews: Record<string, number> = {};
      typedData.forEach(listing => {
        randomViews[listing.id] = Math.floor(Math.random() * 100) + 20;
      });
      setViews(randomViews);

    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId];
      
      // Afficher un toast de confirmation
      toast.success(
        prev.includes(listingId) 
          ? "Retiré des favoris" 
          : "Ajouté aux favoris"
      );
      
      return newFavorites;
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getTypeColor = (listingType: string) => {
    switch (listingType) {
      case 'vente':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400';
      case 'location':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400';
      case 'service':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400';
      default:
        return '';
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return postDate.toLocaleDateString('fr-CA', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        ))}
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

  const handleShare = async (listing: MarketplaceListing) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.description || '',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papier");
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {listings.map((listing) => (
        <Card 
          key={listing.id} 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
        >
          <div className="relative aspect-video group">
            {listing.images?.[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Image className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
                onClick={() => toggleFavorite(listing.id)}
              >
                <Heart 
                  className={`h-5 w-5 transition-colors duration-300 
                    ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold truncate flex-1">{listing.title}</h3>
              <Badge variant="secondary" className={`shrink-0 ${getTypeColor(listing.type)}`}>
                {listing.type}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDate(listing.created_at)}</span>
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

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{views[listing.id] || 0} vues</span>
              </div>
              {listing.seller?.rating != null && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{listing.seller.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="font-semibold text-lg">
                {formatPrice(listing.price, listing.currency)}
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" title="Contacter le vendeur">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleShare(listing)}
                  title="Partager l'annonce"
                >
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
