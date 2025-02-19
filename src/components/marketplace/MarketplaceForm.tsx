
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Image as ImageIcon,
  X,
  Upload
} from "lucide-react";

type ListingType = "vente" | "location" | "service";

export function MarketplaceForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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

  const handleImagePreview = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const urls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Clean up URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Upload images first
      const uploadedImageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `marketplace/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('listings')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          return filePath;
        })
      );

      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        currency: formData.currency,
        condition: formData.condition,
        location: formData.location,
        category: formData.category,
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
      setImageFiles([]);
      setImageUrls([]);
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
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'annonce</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
          maxLength={100}
          placeholder="ex: iPhone 13 Pro Max - 256GB"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          className="min-h-[100px]"
          placeholder="Décrivez votre article, son état, ses caractéristiques..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type d'annonce</Label>
          <Select
            value={formData.type}
            onValueChange={(value: ListingType) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vente">Vente</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">État</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="État du produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Neuf</SelectItem>
              <SelectItem value="like-new">Comme neuf</SelectItem>
              <SelectItem value="good">Bon état</SelectItem>
              <SelectItem value="fair">État correct</SelectItem>
              <SelectItem value="poor">À rénover</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Ville, Province"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative aspect-square group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {imageUrls.length < 8 && (
            <Button
              type="button"
              variant="outline"
              className="aspect-square flex flex-col items-center justify-center gap-2"
              onClick={() => document.getElementById('images')?.click()}
            >
              <Upload className="h-6 w-6" />
              <span className="text-xs">Ajouter</span>
            </Button>
          )}
        </div>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleImagePreview(e.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          Ajoutez jusqu'à 8 images. Format: JPG, PNG (max 5MB/image)
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Publication en cours..." : "Publier l'annonce"}
      </Button>
    </form>
  );
}
