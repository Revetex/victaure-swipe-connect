
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
  Loader2,
  Eye,
  Star,
  Image
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceListing, MarketplaceFilters } from "@/types/marketplace";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MarketplaceListProps {
  type: "all" | "vente" | "location" | "service";
  searchQuery: string;
  filters: MarketplaceFilters;
  page: number;
  onPageChange: (page: number) => void;
}

export function MarketplaceList({ 
  type, 
  searchQuery, 
  filters,
  page,
  onPageChange 
}: MarketplaceListProps) {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [views, setViews] = useState<Record<string, number>>({});
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchListings();
  }, [type, searchQuery, filters, page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Calculate range
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('marketplace_listings')
        .select(`
          id,
          title,
          description,
          price,
          currency,
          type,
          status,
          seller_id,
          created_at,
          updated_at,
          images,
          seller:profiles!marketplace_listings_seller_id_fkey (
            full_name,
            avatar_url,
            rating
          )
        `, { count: 'exact' })
        .eq('status', 'active')
        .range(from, to);

      // Apply filters
      if (type !== "all") {
        query = query.eq('type', type);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.rating) {
        query = query.gte('seller.rating', filters.rating);
      }

      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      // Apply sorting
      const { sortBy, sortOrder } = filters;
      switch (sortBy) {
        case 'date':
          query = query.order('created_at', { ascending: sortOrder === 'asc' });
          break;
        case 'price':
          query = query.order('price', { ascending: sortOrder === 'asc' });
          break;
        case 'rating':
          query = query.order('seller(rating)', { ascending: sortOrder === 'asc' });
          break;
        case 'views':
          query = query.order('views', { ascending: sortOrder === 'asc' });
          break;
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      if (data) {
        const formattedData: MarketplaceListing[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          currency: item.currency,
          type: item.type,
          status: item.status,
          seller_id: item.seller_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          images: item.images,
          seller: {
            full_name: item.seller?.full_name || null,
            avatar_url: item.seller?.avatar_url || null,
            rating: item.seller?.rating
          }
        }));

        setListings(formattedData);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

        // Simuler des vues aléatoires pour la démo
        const randomViews: Record<string, number> = {};
        formattedData.forEach(listing => {
          randomViews[listing.id] = Math.floor(Math.random() * 100) + 20;
        });
        setViews(randomViews);
      }

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
    <div className="space-y-6">
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => page > 1 && onPageChange(page - 1)}
              className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={pageNum === page}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              pageNum === page - 2 ||
              pageNum === page + 2
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext 
              onClick={() => page < totalPages && onPageChange(page + 1)}
              className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
