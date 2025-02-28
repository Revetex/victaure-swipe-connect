
import { Card } from "@/components/ui/card";
import {
  Eye,
  ShoppingBag,
  TrendingUp,
  Activity,
  DollarSign,
  BarChart
} from "lucide-react";
import { MarketplaceStats as Stats } from "@/types/marketplace";

interface StatsProps {
  stats: Stats;
}

export function MarketplaceStats({ stats }: StatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Annonces actives</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">{stats.activeListings}</p>
        <p className="text-xs text-muted-foreground">
          Sur {stats.totalListings} annonces au total
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Vues totales</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">{stats.totalViews}</p>
        <p className="text-xs text-muted-foreground">
          {(stats.totalViews / stats.activeListings).toFixed(1)} vues par annonce
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Prix moyen</h3>
        </div>
        <p className="mt-2 text-2xl font-bold">
          {stats.averagePrice.toLocaleString('fr-CA', {
            style: 'currency',
            currency: 'CAD'
          })}
        </p>
      </Card>

      <Card className="p-4 md:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Répartition par type</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {Object.entries(stats.listingsByType).map(([type, count]) => (
            <div key={type} className="text-center">
              <div className="text-lg font-bold">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{type}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 md:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Catégories populaires</h3>
        </div>
        <div className="grid gap-2">
          {stats.popularCategories.map(({ category, count }) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm">{category}</span>
              <span className="text-sm text-muted-foreground">{count} annonces</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
