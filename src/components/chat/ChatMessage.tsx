import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { missionCategories } from "@/types/job";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatMessageProps {
  message: {
    content: string;
    role: "assistant" | "user";
    type?: "job_creation" | "text";
    step?: "title" | "description" | "budget" | "location" | "category" | "confirm";
  };
  onResponse?: (response: string) => void;
}

export function ChatMessage({ message, onResponse }: ChatMessageProps) {
  const [response, setResponse] = useState("");
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    category: "Technology",
  });

  const handleJobDataSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer une mission");
        return;
      }

      const { error } = await supabase.from("jobs").insert({
        title: jobData.title,
        description: jobData.description,
        budget: parseFloat(jobData.budget),
        location: jobData.location,
        category: jobData.category,
        employer_id: user.id,
      });

      if (error) throw error;

      toast.success("Mission créée avec succès !");
      onResponse?.("La mission a été créée avec succès. Je peux vous aider avec autre chose ?");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Erreur lors de la création de la mission");
    }
  };

  const renderJobCreationStep = () => {
    switch (message.step) {
      case "title":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Ex: Développeur React Senior"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            />
            <Button 
              onClick={() => onResponse?.(jobData.title)}
              disabled={!jobData.title}
            >
              Suivant
            </Button>
          </div>
        );
      case "description":
        return (
          <div className="space-y-2">
            <Textarea
              placeholder="Décrivez les responsabilités et les attentes..."
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />
            <Button 
              onClick={() => onResponse?.(jobData.description)}
              disabled={!jobData.description}
            >
              Suivant
            </Button>
          </div>
        );
      case "budget":
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Budget en CAD"
              value={jobData.budget}
              onChange={(e) => setJobData({ ...jobData, budget: e.target.value })}
            />
            <Button 
              onClick={() => onResponse?.(jobData.budget)}
              disabled={!jobData.budget}
            >
              Suivant
            </Button>
          </div>
        );
      case "location":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Ex: Montréal, QC"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
            />
            <Button 
              onClick={() => onResponse?.(jobData.location)}
              disabled={!jobData.location}
            >
              Suivant
            </Button>
          </div>
        );
      case "category":
        return (
          <div className="space-y-2">
            <Select
              value={jobData.category}
              onValueChange={(value) => setJobData({ ...jobData, category: value })}
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
            <Button 
              onClick={() => onResponse?.(jobData.category)}
              disabled={!jobData.category}
            >
              Suivant
            </Button>
          </div>
        );
      case "confirm":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">Titre : {jobData.title}</p>
              <p className="font-semibold">Description : {jobData.description}</p>
              <p className="font-semibold">Budget : {jobData.budget} CAD</p>
              <p className="font-semibold">Localisation : {jobData.location}</p>
              <p className="font-semibold">Catégorie : {jobData.category}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onResponse?.("modifier")}>
                Modifier
              </Button>
              <Button onClick={handleJobDataSubmit}>
                Confirmer et créer
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        message.role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      <Avatar className="h-8 w-8">
        <div className={cn(
          "h-8 w-8 rounded-full",
          message.role === "assistant" ? "bg-primary" : "bg-muted"
        )} />
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="text-sm text-foreground">{message.content}</p>
        {message.type === "job_creation" && renderJobCreationStep()}
      </div>
    </div>
  );
}