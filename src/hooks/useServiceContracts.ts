
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ServiceContract = {
  id: string;
  contractor_id: string;
  client_id?: string;
  title: string;
  description?: string;
  contract_type: string;
  status: "draft" | "pending" | "active" | "completed" | "cancelled";
  fixed_price?: number;
  min_bid?: number;
  max_bid?: number;
  start_date?: string;
  end_date?: string;
  payment_status?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
};

type ServiceContractWithContractor = ServiceContract & {
  contractor: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export function useServiceContracts() {
  const { data: contracts, isLoading, error } = useQuery<ServiceContractWithContractor[]>({
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
      return data as ServiceContractWithContractor[];
    }
  });

  const createContract = async (
    contract: Omit<ServiceContract, 'id' | 'contractor_id' | 'created_at' | 'updated_at'>
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
          contractor_id: user.id,
          contract_type: contract.contract_type || 'standard',
          status: 'draft',
          title: contract.title,
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
