
import { useMarketplaceItems } from "@/hooks/useMarketplaceItems";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function ItemsList() {
  const { items, isLoading } = useMarketplaceItems();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const getSourceBadge = (item: any) => {
    if (item.external_source === 'kijiji') {
      return (
        <Badge variant="secondary" className="ml-2">
          Kijiji
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Aucun article disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {item.images?.[0] && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={item.images[0]} 
                alt={item.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          )}
          
          <div className="p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
                  {getSourceBadge(item)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>
              <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                {item.status === 'active' ? 'Disponible' : 'Vendu'}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{item.location ? JSON.stringify(item.location) : 'Non spécifié'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={item.seller?.avatar_url} />
                <AvatarFallback>
                  {item.seller?.full_name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.seller?.full_name || (item.external_source ? 'Vendeur externe' : 'Anonyme')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  <DollarSign className="h-4 w-4 inline-block" />
                  {item.price}
                </p>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => setSelectedItem(item)}
            >
              Voir les détails
            </Button>
          </div>
        </Card>
      ))}

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              {selectedItem?.title}
              {getSourceBadge(selectedItem)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem?.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedItem.images.map((image: string, index: number) => (
                <img 
                  key={index}
                  src={image}
                  alt={`${selectedItem.title} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-muted-foreground">
              {selectedItem?.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">État</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedItem?.condition || 'Non spécifié'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Prix</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedItem?.price} {selectedItem?.currency}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-1">Vendeur</h4>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedItem?.seller?.avatar_url} />
                  <AvatarFallback>
                    {selectedItem?.seller?.full_name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedItem?.seller?.full_name || (selectedItem?.external_source ? 'Vendeur externe' : 'Anonyme')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem?.external_source ? (
                      `Annonce de ${selectedItem.external_source}`
                    ) : (
                      `Membre depuis ${formatDistanceToNow(new Date(selectedItem?.seller?.created_at), {
                        locale: fr
                      })}`
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="ghost"
                onClick={() => setSelectedItem(null)}
              >
                Fermer
              </Button>
              <Button onClick={() => {
                if (selectedItem?.external_url) {
                  window.open(selectedItem.external_url, '_blank');
                } else {
                  // Contact logic for internal listings
                }
              }}>
                {selectedItem?.external_url ? 'Voir sur Kijiji' : 'Contacter le vendeur'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
