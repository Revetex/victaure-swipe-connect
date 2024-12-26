import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SwipeMatch } from "./SwipeMatch";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: ""
  });

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

      // Get the user's profile to verify they exist and get their role
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

      // Verify the user is an employer
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
        status: 'open'
      });

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: "Votre offre a été créée avec succès"
      });

      setIsOpen(false);
      setFormData({
        title: "",
        description: "",
        budget: "",
        location: ""
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
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offres disponibles</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="button-enhanced" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une offre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle offre</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex justify-center">
        <SwipeMatch />
      </div>
    </div>
  );
}