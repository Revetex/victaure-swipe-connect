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
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log("Starting deletion process for job:", jobId);
      
      // 1. D'abord, récupérer tous les matches associés à ce job
      const { data: matches, error: matchesQueryError } = await supabase
        .from('matches')
        .select('id')
        .eq('job_id', jobId);

      if (matchesQueryError) {
        console.error("Error fetching matches:", matchesQueryError);
        toast.error("Erreur lors de la récupération des matches");
        return;
      }

      const matchIds = matches?.map(match => match.id) || [];
      console.log("Found matches:", matchIds);

      if (matchIds.length > 0) {
        // 2. Supprimer tous les paiements associés à ces matches
        const { error: paymentsError } = await supabase
          .from('payments')
          .delete()
          .in('match_id', matchIds);

        if (paymentsError) {
          console.error("Error deleting payments:", paymentsError);
          toast.error("Erreur lors de la suppression des paiements");
          return;
        }
        console.log("Payments deleted successfully");

        // 3. Supprimer les matches
        const { error: matchesDeleteError } = await supabase
          .from('matches')
          .delete()
          .eq('job_id', jobId);

        if (matchesDeleteError) {
          console.error("Error deleting matches:", matchesDeleteError);
          toast.error("Erreur lors de la suppression des matches");
          return;
        }
        console.log("Matches deleted successfully");
      }

      // 4. Finalement, supprimer l'offre
      const { error: jobError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (jobError) {
        console.error("Error deleting job:", jobError);
        toast.error("Erreur lors de la suppression de l'offre");
        return;
      }

      console.log("Job deleted successfully");
      toast.success("Offre supprimée avec succès");
      onDelete();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Une erreur est survenue lors de la suppression");
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