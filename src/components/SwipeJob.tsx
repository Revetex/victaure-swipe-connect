import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Briefcase, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Développeur Full Stack",
    company: "Tech Solutions",
    location: "Paris",
    salary: "500-600€ / jour",
    description: "Nous recherchons un développeur Full Stack expérimenté...",
  },
  {
    id: 2,
    title: "Lead Developer",
    company: "Digital Agency",
    location: "Lyon",
    salary: "600-700€ / jour",
    description: "Rejoignez notre équipe en tant que Lead Developer...",
  },
];

export function SwipeJob() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
  });

  const currentJob = mockJobs[currentJobIndex];

  const handleSwipe = (like: boolean) => {
    if (like) {
      setShowForm(true);
    } else if (currentJobIndex < mockJobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            budget: parseFloat(formData.budget),
            location: formData.location,
          }
        ]);

      if (error) throw error;

      toast.success("Votre demande a été envoyée avec succès!");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        budget: "",
        location: "",
      });
      
      if (currentJobIndex < mockJobs.length - 1) {
        setCurrentJobIndex(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
      console.error("Error submitting job request:", error);
    }
  };

  return (
    <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 text-victaure-blue mb-6">
        <Briefcase className="h-5 w-5" />
        <h2 className="text-lg font-semibold">SwipeJob</h2>
      </div>

      {!showForm ? (
        <>
          {currentJob && (
            <Card className="bg-victaure-dark/30 border-victaure-blue/20">
              <CardHeader>
                <CardTitle>{currentJob.title}</CardTitle>
                <div className="text-sm text-victaure-gray">
                  {currentJob.company} • {currentJob.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-victaure-blue font-semibold mb-2">
                  {currentJob.salary}
                </div>
                <p className="text-sm text-victaure-gray">
                  {currentJob.description}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-victaure-orange hover:bg-victaure-orange/20"
              onClick={() => handleSwipe(false)}
            >
              <ThumbsDown className="h-5 w-5 text-victaure-orange" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-victaure-blue hover:bg-victaure-blue/20"
              onClick={() => handleSwipe(true)}
            >
              <ThumbsUp className="h-5 w-5 text-victaure-blue" />
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la mission</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Développeur Frontend React"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre besoin en détail..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (par jour)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Ex: 500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Paris, France"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}