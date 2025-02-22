
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Edit, Trash2, Eye } from "lucide-react";

interface JobsListProps {
  jobs: Job[];
  isLoading?: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onView?: (job: Job) => void;
  onJobSelect?: (job: Job) => void;
  selectedJobId?: string;
}

export function JobsList({ 
  jobs, 
  isLoading, 
  onEdit, 
  onDelete, 
  onView,
  onJobSelect,
  selectedJobId 
}: JobsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobs?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">Aucune offre d'emploi publiée</p>
          <Button variant="outline" className="mt-4">
            Créer une offre
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card 
          key={job.id}
          className={selectedJobId === job.id ? "ring-2 ring-primary" : ""}
          onClick={() => onJobSelect?.(job)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.location || "Aucune localisation"}
                </p>
              </div>
              <div className="space-x-2">
                {onView && (
                  <Button variant="ghost" size="icon" onClick={() => onView(job)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button variant="ghost" size="icon" onClick={() => onEdit(job)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="icon" onClick={() => onDelete(job)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {job.description}
            </p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <div className="flex justify-between w-full">
              <span>
                Publié {formatDistance(new Date(job.created_at || new Date()), new Date(), { locale: fr })}
              </span>
              <span className={`capitalize ${job.status === 'open' ? 'text-green-600' : 'text-yellow-600'}`}>
                {job.status}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
