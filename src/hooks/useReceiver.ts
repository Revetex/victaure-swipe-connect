import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Receiver } from '@/types/messages';

const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export function useReceiver() {
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceiverFromUrl = async () => {
      const path = location.pathname;
      const match = path.match(/\/messages\/([^\/]+)/);
      
      if (match && match[1]) {
        const receiverId = match[1];
        
        if (!isValidUUID(receiverId)) {
          console.error("Invalid UUID format:", receiverId);
          setShowConversation(false);
          setReceiver(null);
          navigate('/dashboard/messages');
          return;
        }

        try {
          const { data: fetchedReceiver, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', receiverId)
            .maybeSingle();

          if (error) throw error;

          if (fetchedReceiver) {
            setReceiver(fetchedReceiver);
            setShowConversation(true);
          } else {
            toast.error("Utilisateur non trouvé");
            navigate('/dashboard/messages');
          }
        } catch (error) {
          console.error("Error fetching receiver:", error);
          toast.error("Erreur lors de la récupération du profil");
          navigate('/dashboard/messages');
        }
      } else {
        setShowConversation(false);
        setReceiver(null);
      }
    };

    fetchReceiverFromUrl();
  }, [location.pathname, navigate]);

  return {
    receiver,
    setReceiver,
    showConversation,
    setShowConversation
  };
}