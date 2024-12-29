import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { missionCategories } from "@/types/job";
import { useState } from "react";

interface JobData {
  title: string;
  description: string;
  budget: string;
  location: string;
  category: string;
}

interface JobCreationFormProps {
  step: "title" | "description" | "budget" | "location" | "category" | "confirm";
  onResponse: (response: string) => void;
  initialData?: Partial<JobData>;
}

export function JobCreationForm({ step, onResponse, initialData = {} }: JobCreationFormProps) {
  const [jobData, setJobData] = useState<JobData>({
    title: initialData.title || "",
    description: initialData.description || "",
    budget: initialData.budget || "",
    location: initialData.location || "",
    category: initialData.category || "Technology",
  });

  const renderStep = () => {
    switch (step) {
      case "title":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Ex: Développeur React Senior"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            />
            <Button 
              onClick={() => onResponse(jobData.title)}
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
              onClick={() => onResponse(jobData.description)}
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
              onClick={() => onResponse(jobData.budget)}
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
              onClick={() => onResponse(jobData.location)}
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
              onClick={() => onResponse(jobData.category)}
              disabled={!jobData.category}
            >
              Suivant
            </Button>
          </div>
        );
      case "confirm":
        return (
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Titre:</span> {jobData.title}</p>
              <p><span className="font-medium">Description:</span> {jobData.description}</p>
              <p><span className="font-medium">Budget:</span> {jobData.budget} CAD</p>
              <p><span className="font-medium">Localisation:</span> {jobData.location}</p>
              <p><span className="font-medium">Catégorie:</span> {jobData.category}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onResponse("modifier")}>
                Modifier
              </Button>
              <Button onClick={() => onResponse("confirmer")}>
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
    <div className="mt-2">
      {renderStep()}
    </div>
  );
}