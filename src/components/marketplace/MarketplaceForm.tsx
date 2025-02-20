
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MarketplaceService } from "@/types/marketplace";

export function MarketplaceForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "vente",
    currency: "CAD",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from('marketplace_items')
        .insert({
          ...formData,
          price: parseFloat(formData.price),
          seller_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre annonce a été publiée",
      });

      setFormData({
        title: "",
        description: "",
        price: "",
        type: "vente",
        currency: "CAD",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de publier l'annonce",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

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
        <select
          id="type"
          className="w-full p-2 border rounded"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="vente">Vente</option>
          <option value="location">Location</option>
          <option value="service">Service</option>
        </select>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Publication..." : "Publier l'annonce"}
      </Button>
    </form>
  );
}
