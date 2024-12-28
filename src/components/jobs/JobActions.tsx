import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface JobActionsProps {
  jobId: string;
  employerId: string | undefined;
  onDelete: () => void;
  onEdit: () => void;
}

export function JobActions({ jobId, employerId, onDelete, onEdit }: JobActionsProps) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwner(user?.id === employerId);
    };
    
    checkOwnership();
  }, [employerId]);

  const handleDelete = async () => {
    try {
      // First, delete all matches associated with this job
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .eq('job_id', jobId);

      if (matchesError) {
        console.error("Error deleting matches:", matchesError);
        toast.error("Erreur lors de la suppression des matches associés");
        return;
      }

      // Then delete the job
      const { error: jobError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (jobError) {
        console.error("Error deleting job:", jobError);
        toast.error("Erreur lors de la suppression de l'offre");
        return;
      }
      
      toast.success("Offre supprimée avec succès");
      onDelete();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Une erreur est survenue");
    }
  };

  if (!isOwner) return null;

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-700"
      >
        <Edit className="h-4 w-4 mr-2" />
        Modifier
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="h-4 w-4 mr-2" />
        Supprimer
      </Button>
    </div>
  );
}