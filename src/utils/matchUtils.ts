import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function createMatch(jobId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour postuler");
      return false;
    }

    const { error } = await supabase
      .from('matches')
      .insert({
        job_id: jobId,
        professional_id: user.id,
        status: 'pending'
      });

    if (error) {
      console.error('Error creating match:', error);
      toast.error("Impossible de postuler à cette offre");
      return false;
    }

    toast.success("Vous avez postulé à cette offre");
    return true;
  } catch (error) {
    console.error('Error in createMatch:', error);
    toast.error("Une erreur est survenue");
    return false;
  }
}