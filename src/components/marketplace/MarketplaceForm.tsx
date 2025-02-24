
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./form/ImageUpload";
import { useListingImages } from "./hooks/useListingImages";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ListingType } from "@/types/marketplace";

export function MarketplaceForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
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
    saleType: "immediate",
    auctionEndDate: null as Date | null,
    minimumBid: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.description || !formData.price) {
        toast.error("Veuillez remplir tous les champs requis");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      let uploadedImageUrls: string[] = [];
      if (imageUrls.length > 0) {
        uploadedImageUrls = await uploadImages();
      }

      const { error } = await supabase
        .from('marketplace_listings')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            type: formData.type,
            currency: formData.currency,
            images: uploadedImageUrls,
            seller_id: user.id,
            status: 'active',
          }
        ]);

      if (error) throw error;

      toast.success("Annonce publiée avec succès !");
      resetImages();
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "vente",
        currency: "CAD",
        condition: "new",
        location: "",
        category: "",
        saleType: "immediate",
        auctionEndDate: null,
        minimumBid: "",
      });
      setOpen(false);
      
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error("Une erreur est survenue lors de la publication de l'annonce");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Type de vente</Label>
              <Select 
                value={formData.saleType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, saleType: value }))}
              >
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
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Décrivez votre article en détail..." 
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
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
                  required
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
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fin des enchères</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.auctionEndDate?.toISOString().slice(0, 16) || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, auctionEndDate: new Date(e.target.value) }))}
                    required
                  />
                </div>
              </div>
            )}

            <ImageUpload
              imageUrls={imageUrls}
              onImageUpload={handleImagePreview}
              onImageRemove={removeImage}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Publication en cours..." : "Publier l'annonce"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
