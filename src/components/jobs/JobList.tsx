import { Job } from "@/types/job";
import { JobCard } from "@/components/JobCard";
import { JobActions } from "./JobActions";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { CreateJobForm } from "./CreateJobForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  onJobDeleted: () => void;
}

export function JobList({ jobs, isLoading, error, onJobDeleted }: JobListProps) {
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    onJobDeleted();
    toast.success("Mission mise à jour avec succès");
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-3 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-3 flex justify-center items-center min-h-[400px]">
        <p className="text-destructive">Une erreur est survenue lors du chargement des missions</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-4">
      {jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune mission disponible pour le moment
        </div>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <JobCard {...job} />
            <JobActions
              jobId={job.id}
              employerId={job.employer_id}
              onDelete={onJobDeleted}
              onEdit={() => {
                setEditingJob(job);
                setIsEditDialogOpen(true);
              }}
            />
          </div>
        ))
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-victaure-blue">
              Modifier la mission
            </DialogTitle>
            <DialogDescription className="text-victaure-gray-dark">
              Modifiez les informations de votre mission ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            {editingJob && (
              <CreateJobForm
                initialData={editingJob}
                onSuccess={handleEditSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}