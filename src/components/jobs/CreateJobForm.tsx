import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { missionCategories } from "@/types/job";

interface CreateJobFormProps {
  onSuccess: () => void;
}

export function CreateJobForm({ onSuccess }: CreateJobFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    category: "Technologie",
    contract_type: "Full-time",
    experience_level: "Mid-Level"
  });

  const contractTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Temporary"
  ];

  const experienceLevels = [
    "Entry-Level",
    "Mid-Level",
    "Senior",
    "Expert"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une offre",
          variant: "destructive"
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Erreur",
          description: "Impossible de vérifier votre profil",
          variant: "destructive"
        });
        return;
      }

      if (profile.role !== 'employer') {
        toast({
          title: "Erreur",
          description: "Seuls les employeurs peuvent créer des offres",
          variant: "destructive"
        });
        return;
      }

      const { error: insertError } = await supabase.from("jobs").insert({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        location: formData.location,
        employer_id: user.id,
        status: 'open',
        category: formData.category,
        contract_type: formData.contract_type,
        experience_level: formData.experience_level
      });

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: "Votre offre a été créée avec succès"
      });

      onSuccess();
      setFormData({
        title: "",
        description: "",
        budget: "",
        location: "",
        category: "Technologie",
        contract_type: "Full-time",
        experience_level: "Mid-Level"
      });
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'offre",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(missionCategories).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contract_type">Type de contrat</Label>
        <Select
          value={formData.contract_type}
          onValueChange={(value) => setFormData({ ...formData, contract_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type de contrat" />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience_level">Niveau d'expérience</Label>
        <Select
          value={formData.experience_level}
          onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un niveau d'expérience" />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Créer l'offre
      </Button>
    </form>
  );
}