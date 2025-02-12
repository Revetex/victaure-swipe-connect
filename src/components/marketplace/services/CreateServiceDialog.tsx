
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import { MarketplaceCategory } from "@/types/marketplace/types";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MarketplaceCategory[];
  onSuccess?: () => void;
}

export function CreateServiceDialog({ open, onOpenChange, categories, onSuccess }: CreateServiceDialogProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    type: "",
    category: "",
    description: "",
    images: [] as string[],
    auctionEndDate: ""
  });

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('marketplace_services')
        .insert({
          title: formData.title,
          price: parseFloat(formData.price),
          type: formData.type,
          category_id: formData.category || null,
          description: formData.description,
          images: formData.images,
          provider_id: user.id,
          auction_end_date: formData.type === 'auction' ? formData.auctionEndDate : null
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Service publié avec succès");
      onOpenChange(false);
      onSuccess?.();
      setFormData({
        title: "",
        price: "",
        type: "",
        category: "",
        description: "",
        images: [],
        auctionEndDate: ""
      });
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error("Erreur lors de la publication du service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl",
        isMobile && "w-[calc(100%-2rem)] top-[50%]"
      )}>
        <DialogHeader>
          <DialogTitle>Proposer un service</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Nom du service"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
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
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
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
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>

          {formData.type === 'auction' && (
            <div className="space-y-2">
              <Label htmlFor="auctionEndDate">Date de fin d'enchère</Label>
              <Input
                id="auctionEndDate"
                type="datetime-local"
                value={formData.auctionEndDate}
                onChange={(e) => setFormData(prev => ({ ...prev, auctionEndDate: e.target.value }))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre service..."
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Publication en cours..." : "Publier le service"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
