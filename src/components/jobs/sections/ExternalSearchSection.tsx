
import { useState } from "react";
import { JobList } from "../JobList";
import { Job } from "@/types/job";

export function ExternalSearchSection() {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Recherche externe</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Consultez les offres d'emploi de nos partenaires
      </p>
      {/* Le contenu de JobList sera ajouté lorsque les données externes seront disponibles */}
    </div>
  );
}
