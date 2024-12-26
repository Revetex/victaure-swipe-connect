import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: profile } = await supabase.auth.getUser();
      
      if (!profile.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une offre",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from("jobs").insert({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        location: formData.location,
        employer_id: profile.user.id
      });

      if (error) throw error;

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-2">Développeur Frontend React</h3>
          <p className="text-sm text-gray-600 mb-4">
            Nous recherchons un développeur React expérimenté pour rejoindre notre équipe...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">5000€/mois</span>
            <span className="text-sm text-gray-500">Paris, France</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-2">UX/UI Designer Senior</h3>
          <p className="text-sm text-gray-600 mb-4">
            Recherche designer expérimenté pour concevoir des interfaces innovantes...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">4500€/mois</span>
            <span className="text-sm text-gray-500">Lyon, France</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-2">DevOps Engineer</h3>
          <p className="text-sm text-gray-600 mb-4">
            Nous cherchons un DevOps pour gérer notre infrastructure cloud...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">6000€/mois</span>
            <span className="text-sm text-gray-500">Remote</span>
          </div>
        </div>
      </div>
    </div>
  );
}