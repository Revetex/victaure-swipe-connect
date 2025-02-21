
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./form/ImageUpload";
import { ListingDetails } from "./form/ListingDetails";
import { ListingSelectors } from "./form/ListingSelectors";
import { useListingImages } from "./hooks/useListingImages";
import { toast } from "sonner";
import type { ListingType } from "@/types/marketplace";

export function MarketplaceForm() {
  const [loading, setLoading] = useState(false);
  const { imageUrls, handleImagePreview, removeImage, uploadImages, resetImages } = useListingImages();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "vente" as ListingType,
    currency: "CAD",
    condition: "new",
    location: "",
    category: "",
    saleType: "immediate", // 'immediate' ou 'auction'
    auctionEndDate: null as Date | null,
    minimumBid: "",
  });

  return (
    <form className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Type de vente</Label>
          <Select value={formData.saleType} onValueChange={(value) => setFormData(prev => ({ ...prev, saleType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez le type de vente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Prix immédiat</SelectItem>
              <SelectItem value="auction">Enchères</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Titre de l'annonce</Label>
          <Input 
            placeholder="Titre de votre annonce" 
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea 
            placeholder="Décrivez votre article en détail..." 
            className="min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {formData.saleType === 'immediate' ? (
          <div className="grid gap-2">
            <Label>Prix fixe</Label>
            <Input 
              type="number" 
              placeholder="Prix en CAD"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Prix de départ</Label>
              <Input 
                type="number" 
                placeholder="Prix minimal en CAD"
                value={formData.minimumBid}
                onChange={(e) => setFormData(prev => ({ ...prev, minimumBid: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Fin des enchères</Label>
              <Input 
                type="datetime-local"
                value={formData.auctionEndDate?.toISOString().slice(0, 16) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, auctionEndDate: new Date(e.target.value) }))}
              />
            </div>
          </div>
        )}

        <ImageUpload
          imageUrls={imageUrls}
          onImageUpload={handleImagePreview}
          onImageRemove={removeImage}
        />

        <div className="flex justify-end gap-4 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button type="submit">Publier l'annonce</Button>
        </div>
      </div>
    </form>
  );
}
