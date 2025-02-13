
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PaymentTypes } from "@/types/database/payments";

type ServiceContract = PaymentTypes['Tables']['service_contracts']['Row'] & {
  contractor: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export function useServiceContracts() {
  const { data: contracts, isLoading, error } = useQuery({
    queryKey: ['service-contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_contracts')
        .select(`
          *,
          contractor:profiles!service_contracts_contractor_id_fkey(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceContract[];
    }
  });

  const createContract = async (
    contract: Omit<PaymentTypes['Tables']['service_contracts']['Insert'], 'contractor_id'>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour créer un contrat");
        return;
      }

      const { error } = await supabase
        .from('service_contracts')
        .insert({
          ...contract,
          contractor_id: user.id
        });

      if (error) throw error;
      
      toast.success("Le contrat a été créé avec succès");
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error("Une erreur est survenue lors de la création du contrat");
    }
  };

  return {
    contracts,
    isLoading,
    error,
    createContract
  };
}
