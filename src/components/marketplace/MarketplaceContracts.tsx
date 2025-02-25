
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { MarketplaceContract } from "@/types/marketplace";
import { ContractCard } from "./contracts/ContractCard";
import { ContractsLoading } from "./contracts/ContractsLoading";
import { ContractsEmpty } from "./contracts/ContractsEmpty";

export function MarketplaceContracts() {
  const [contracts, setContracts] = useState<MarketplaceContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_contracts')
        .select(`
          id,
          title,
          description,
          budget_min,
          budget_max,
          deadline,
          status,
          location,
          currency,
          category,
          requirements,
          documents,
          created_at,
          updated_at,
          creator_id,
          creator:profiles!marketplace_contracts_creator_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setContracts(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des contrats:', error);
      toast.error("Erreur lors du chargement des contrats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ContractsLoading />;
  }

  if (contracts.length === 0) {
    return <ContractsEmpty />;
  }

  return (
    <div className="grid gap-4">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}
