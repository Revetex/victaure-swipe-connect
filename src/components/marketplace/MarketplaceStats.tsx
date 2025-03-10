
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MarketplaceStats } from "@/types/marketplace";
import { TrendingUp, Eye, Heart, Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function MarketplaceStatsComponent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MarketplaceStats>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0, 
    totalFavorites: 0,
    popularCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch total listings
        const { count: totalListings, error: listingsError } = await supabase
          .from('marketplace_listings')
          .select('*', { count: 'exact', head: true });

        if (listingsError) throw listingsError;

        // Fetch active listings
        const { count: activeListings, error: activeError } = await supabase
          .from('marketplace_listings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        if (activeError) throw activeError;

        // Fetch total views
        const { count: totalViews, error: viewsError } = await supabase
          .from('marketplace_views')
          .select('*', { count: 'exact', head: true });

        if (viewsError) throw viewsError;

        // Fetch total favorites
        const { count: totalFavorites, error: favoritesError } = await supabase
          .from('marketplace_favorites')
          .select('*', { count: 'exact', head: true });

        if (favoritesError) throw favoritesError;

        // Set the stats
        setStats({
          totalListings: totalListings || 0,
          activeListings: activeListings || 0,
          totalViews: totalViews || 0,
          totalFavorites: totalFavorites || 0,
          popularCategories: []
        });
      } catch (error) {
        console.error("Error fetching marketplace stats:", error);
        setError("Failed to load marketplace statistics");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard 
        title="Annonces actives" 
        value={stats.activeListings} 
        icon={<TrendingUp className="h-4 w-4" />} 
        loading={loading}
      />
      <StatsCard 
        title="Total des annonces" 
        value={stats.totalListings} 
        icon={<Tag className="h-4 w-4" />} 
        loading={loading}
      />
      <StatsCard 
        title="Vues totales" 
        value={stats.totalViews} 
        icon={<Eye className="h-4 w-4" />} 
        loading={loading}
      />
      <StatsCard 
        title="Favoris" 
        value={stats.totalFavorites} 
        icon={<Heart className="h-4 w-4" />} 
        loading={loading}
      />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
}

function StatsCard({ title, value, icon, loading }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <span className="mr-2 text-muted-foreground">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? "..." : value.toLocaleString()}
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="mt-2 text-xs">
            Détails <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
