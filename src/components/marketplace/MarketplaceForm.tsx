
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "./form/ImageUpload";
import { SaleTypeField } from "./form/SaleTypeField";
import { ListingTypeField } from "./form/ListingTypeField";
import { CategoryField } from "./form/CategoryField";
import { ListingDetails } from "./form/ListingDetails";
import { LocationField } from "./form/LocationField";
import { PricingFields } from "./form/PricingFields";
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

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            <SaleTypeField 
              value={formData.saleType} 
              onChange={(value) => handleFieldChange('saleType', value)} 
            />

            <ListingTypeField 
              value={formData.type} 
              onChange={(value) => handleFieldChange('type', value)} 
            />

            <CategoryField 
              value={formData.category} 
              onChange={(value) => handleFieldChange('category', value)} 
            />

            <ListingDetails
              title={formData.title}
              description={formData.description}
              onChange={handleFieldChange}
            />

            <LocationField
              location={formData.location}
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationSelect={handleLocationSelect}
            />

            <PricingFields
              saleType={formData.saleType}
              price={formData.price}
              minimumBid={formData.minimumBid}
              auctionEndDate={formData.auctionEndDate}
              onChange={handleFieldChange}
            />

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
