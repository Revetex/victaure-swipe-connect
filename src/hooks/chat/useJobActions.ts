
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ConversationContext } from './types';
import { UserProfile } from '@/types/profile';

export function useJobActions(
  profile: UserProfile | null,
  setConversationContext: (updater: (prev: ConversationContext) => ConversationContext) => void,
  handleSendMessage: (content: string) => void
) {
  const handleJobAccept = useCallback(async (jobId: string) => {
    try {
      await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: profile?.id,
          status: 'interested'
        });

      setConversationContext(prev => ({
        ...prev,
        acceptedJobs: [...prev.acceptedJobs, jobId]
      }));

      toast.success("Votre intérêt a été enregistré!");
      
      handleSendMessage("Je suis intéressé par ce poste, pouvez-vous m'aider à postuler ?");
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error("Erreur lors de l'enregistrement de votre intérêt");
    }
  }, [profile, handleSendMessage, setConversationContext]);

  const handleJobReject = useCallback((jobId: string) => {
    setConversationContext(prev => ({
      ...prev,
      rejectedJobs: [...prev.rejectedJobs, jobId]
    }));
  }, [setConversationContext]);

  return {
    handleJobAccept,
    handleJobReject
  };
}
