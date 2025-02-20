
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "./form/ImageUpload";
import { ListingDetails } from "./form/ListingDetails";
import { ListingSelectors } from "./form/ListingSelectors";
import { useListingImages } from "./hooks/useListingImages";

type ListingType = "vente" | "location" | "service";

export function MarketplaceForm() {
  const { toast } = useToast();
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const uploadedImageUrls = await uploadImages();

      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
        seller_id: user.id,
        images: uploadedImageUrls,
        status: 'active'
      };

      const { error } = await supabase
        .from('marketplace_listings')
        .insert([listingData]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre annonce a été publiée",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        type: "vente",
        currency: "CAD",
        condition: "new",
        location: "",
        category: "",
      });
      resetImages();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de publier l'annonce",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ListingDetails
        title={formData.title}
        description={formData.description}
        price={formData.price}
        onTitleChange={(title) => setFormData(prev => ({ ...prev, title }))}
        onDescriptionChange={(description) => setFormData(prev => ({ ...prev, description }))}
        onPriceChange={(price) => setFormData(prev => ({ ...prev, price }))}
      />

      <ListingSelectors
        type={formData.type}
        condition={formData.condition}
        location={formData.location}
        onTypeChange={(type) => setFormData(prev => ({ ...prev, type: type as ListingType }))}
        onConditionChange={(condition) => setFormData(prev => ({ ...prev, condition }))}
        onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
      />

      <ImageUpload
        imageUrls={imageUrls}
        onImageUpload={handleImagePreview}
        onImageRemove={removeImage}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Publication en cours..." : "Publier l'annonce"}
      </Button>
    </form>
  );
}
