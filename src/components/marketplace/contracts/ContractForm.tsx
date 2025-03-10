
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ContractFormValues } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export function ContractForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<ContractFormValues>({
    title: "",
    description: "",
    budget_min: undefined,
    budget_max: undefined,
    deadline: undefined,
    location: "",
    category: "",
    currency: "CAD",
    requirements: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Format the date for database storage
      const formattedDeadline = formValues.deadline 
        ? format(formValues.deadline, 'yyyy-MM-dd') 
        : undefined;
      
      const { error } = await supabase.from("marketplace_contracts").insert({
        creator_id: user.id,
        title: formValues.title,
        description: formValues.description,
        budget_min: formValues.budget_min,
        budget_max: formValues.budget_max,
        deadline: formattedDeadline,
        location: formValues.location,
        category: formValues.category,
        currency: formValues.currency,
        requirements: formValues.requirements || [],
        status: "open",
      });

      if (error) throw error;

      toast({
        title: "Contrat créé",
        description: "Votre contrat a été publié avec succès",
      });

      navigate("/marketplace/contracts");
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le contrat",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget_min">Budget minimum</Label>
            <Input
              id="budget_min"
              name="budget_min"
              type="number"
              value={formValues.budget_min || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="budget_max">Budget maximum</Label>
            <Input
              id="budget_max"
              name="budget_max"
              type="number"
              value={formValues.budget_max || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="deadline">Date limite</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={formValues.deadline ? format(formValues.deadline, 'yyyy-MM-dd') : ""}
            onChange={(e) => {
              if (e.target.value) {
                setFormValues({
                  ...formValues,
                  deadline: new Date(e.target.value)
                });
              } else {
                setFormValues({
                  ...formValues,
                  deadline: undefined
                });
              }
            }}
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select 
            value={formValues.category} 
            onValueChange={(value) => setFormValues({...formValues, category: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IT">Informatique & Tech</SelectItem>
              <SelectItem value="design">Design & Création</SelectItem>
              <SelectItem value="writing">Rédaction & Traduction</SelectItem>
              <SelectItem value="marketing">Marketing & Ventes</SelectItem>
              <SelectItem value="legal">Juridique</SelectItem>
              <SelectItem value="finance">Finance & Comptabilité</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            name="location"
            value={formValues.location}
            onChange={handleChange}
            placeholder="Exemple: Montréal, QC"
          />
        </div>

        <div>
          <Label htmlFor="currency">Devise</Label>
          <Select 
            value={formValues.currency} 
            onValueChange={(value) => setFormValues({...formValues, currency: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAD">Dollar canadien (CAD)</SelectItem>
              <SelectItem value="USD">Dollar américain (USD)</SelectItem>
              <SelectItem value="EUR">Euro (EUR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création en cours..." : "Créer le contrat"}
      </Button>
    </form>
  );
}
