
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
  Eye,
  Star,
  Image
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceFilters } from "@/types/marketplace";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/common/Section";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useListingSearch } from "./hooks/useListingSearch";
import { useState, useEffect } from "react";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Update to pass filters correctly
  const { listings: allListings, isLoading, totalPages } = useListingSearch({
    initialFilters: filters
  });
  
  // Filter listings by type and search query
  const listings = allListings.filter(listing => {
    // Filter by type if not "all"
    const typeMatch = type === "all" || listing.type === type;
    // Filter by search query if provided
    const searchMatch = !searchQuery || 
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('marketplace_favorites')
          .select('item_id')  // Changed from listing_id to item_id based on error
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
          return;
        }

        if (data) {
          setFavorites(data.map(fav => fav.item_id));  // Use item_id instead of listing_id
        }
      } catch (err) {
        console.error('Error in fetchFavorites:', err);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (listingId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter des favoris");
        return;
      }

      const isFavorite = favorites.includes(listingId);

      if (isFavorite) {
        // Retirer des favoris
        const { error } = await supabase
          .from('marketplace_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', listingId);  // Use item_id instead of listing_id

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== listingId));
        toast.success("Retiré des favoris");
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('marketplace_favorites')
          .insert({ 
            user_id: user.id, 
            item_id: listingId  // Use item_id instead of listing_id
          });

        if (error) throw error;

        setFavorites(prev => [...prev, listingId]);
        toast.success("Ajouté aux favoris");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Une erreur est survenue");
    }
  };

  const incrementViews = async (listingId: string) => {
    try {
      // Check if the function exists and adjust parameters as needed
      const userId = (await supabase.auth.getUser()).data.user?.id || "anonymous";
      
      // Adjust call based on actual function signature
      await supabase.rpc('increment_listing_views', { 
        listing_id: listingId,
        viewer_id: userId
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
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

  const handleShare = async (listing: any) => {
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

  const handleViewDetails = (listing: any) => {
    incrementViews(listing.id);
    // Naviguer vers la page de détails (à implémenter)
    toast.info(`Visualisation de "${listing.title}"`);
  };

  if (isLoading) {
    return (
      <Section>
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
      </Section>
    );
  }

  if (listings.length === 0) {
    return (
      <Section>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune annonce trouvée</p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {listings.map((listing) => (
            <Card 
              key={listing.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              onClick={() => handleViewDetails(listing)}
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
                    className="bg-background/50 backdrop-blur-sm hover:bg-background/80 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(listing.id);
                    }}
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors duration-300 
                        ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                </div>
                {listing.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md">
                    Mis en avant
                  </div>
                )}
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
                  {listing.location && (
                    <>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{listing.location}</span>
                    </>
                  )}
                </div>

                {listing.seller?.full_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={listing.seller.avatar_url || ''} />
                      <AvatarFallback>
                        {listing.seller.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{listing.seller.full_name}</span>
                    {listing.seller?.rating != null && (
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{listing.seller.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                )}

                {listing.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listing.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{listing.views_count || 0} vues</span>
                  </div>
                  {listing.sale_type === 'auction' && (
                    <Badge variant="outline" className="text-xs bg-amber-100/20 text-amber-500 border-amber-200/30">
                      Enchère
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="font-semibold text-lg">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Contacter le vendeur"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`Contact avec ${listing.seller?.full_name || 'le vendeur'}`);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(listing);
                      }}
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
    </Section>
  );
}
