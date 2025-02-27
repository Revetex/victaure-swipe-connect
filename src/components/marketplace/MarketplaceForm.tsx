
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./form/ImageUpload";
import { LocationAutocomplete } from "@/components/map/LocationAutocomplete";
import { LocationMap } from "@/components/map/LocationMap";
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
    category: "",
    saleType: "immediate",
    auctionEndDate: null as Date | null,
    minimumBid: "",
    latitude: null as number | null,
    longitude: null as number | null,
    location: "",
  });

  const handleLocationSelect = (location: { latitude: number; longitude: number; name: string }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      location: location.name
    }));
  };

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
            condition: formData.condition,
            category: formData.category,
            latitude: formData.latitude,
            longitude: formData.longitude,
            location: formData.location,
            sale_type: formData.saleType,
            auction_end_date: formData.saleType === 'auction' ? formData.auctionEndDate : null,
            minimum_bid: formData.saleType === 'auction' ? parseFloat(formData.minimumBid) : null,
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
        category: "",
        saleType: "immediate",
        auctionEndDate: null,
        minimumBid: "",
        latitude: null,
        longitude: null,
        location: "",
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
      <DialogContent className="w-full max-w-3xl mx-auto px-2 sm:px-4 bg-[#1A1F2C] text-white border-[#64B5D9]/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className="text-white">Type de vente</Label>
              <Select 
                value={formData.saleType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, saleType: value }))}
              >
                <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
                  <SelectValue placeholder="Choisissez le type de vente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Prix immédiat</SelectItem>
                  <SelectItem value="auction">Enchères</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Type d'annonce</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: ListingType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
                  <SelectValue placeholder="Choisissez le type d'annonce" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vente">Vente</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Catégorie</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
                  <SelectValue placeholder="Choisissez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Électronique</SelectItem>
                  <SelectItem value="furniture">Mobilier</SelectItem>
                  <SelectItem value="clothing">Vêtements</SelectItem>
                  <SelectItem value="vehicles">Véhicules</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Titre de l'annonce</Label>
              <Input 
                placeholder="Titre de votre annonce" 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Description</Label>
              <Textarea 
                placeholder="Décrivez votre article en détail..." 
                className="min-h-[100px] bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Localisation</Label>
              <LocationAutocomplete
                onLocationSelect={handleLocationSelect}
                placeholder="Entrez l'adresse..."
                defaultValue={formData.location}
              />
              {formData.latitude && formData.longitude && (
                <div className="mt-2 h-[200px]">
                  <LocationMap
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    height="200px"
                  />
                </div>
              )}
            </div>

            {formData.saleType === 'immediate' ? (
              <div className="grid gap-2">
                <Label className="text-white">Prix fixe</Label>
                <Input 
                  type="number" 
                  placeholder="Prix en CAD"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-white">Prix de départ</Label>
                  <Input 
                    type="number" 
                    placeholder="Prix minimal en CAD"
                    value={formData.minimumBid}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumBid: e.target.value }))}
                    required
                    className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-white">Fin des enchères</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.auctionEndDate?.toISOString().slice(0, 16) || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, auctionEndDate: new Date(e.target.value) }))}
                    required
                    className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white"
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
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
              >
                {loading ? "Publication en cours..." : "Publier l'annonce"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
