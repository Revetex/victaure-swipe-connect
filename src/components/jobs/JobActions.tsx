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
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwner(user?.id === employerId);
    };
    
    checkOwnership();
  }, [employerId]);

  const handleDelete = async () => {
    if (isDeleting) return; // Éviter les doubles clics
    
    try {
      setIsDeleting(true);
      console.log("Attempting to delete job:", jobId);
      
      // D'abord, supprimer tous les matches associés
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .eq('job_id', jobId);

      if (matchesError) {
        console.error("Error deleting matches:", matchesError);
        toast.error("Erreur lors de la suppression des matches associés");
        return;
      }

      // Ensuite, supprimer les paiements associés aux matches
      const { error: paymentsError } = await supabase
        .from('payments')
        .delete()
        .eq('match_id', jobId);

      if (paymentsError) {
        console.error("Error deleting payments:", paymentsError);
        toast.error("Erreur lors de la suppression des paiements associés");
        return;
      }

      // Enfin, supprimer l'offre
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
    } finally {
      setIsDeleting(false);
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
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="h-4 w-4 mr-2" />
        {isDeleting ? "Suppression..." : "Supprimer"}
      </Button>
    </div>
  );
}