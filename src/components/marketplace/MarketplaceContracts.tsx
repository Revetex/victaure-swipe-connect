
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
          creator:profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Assurons-nous que les données correspondent au type attendu
      const typedData: MarketplaceContract[] = data?.map(contract => ({
        ...contract,
        description: contract.description || null,
        budget_min: contract.budget_min || null,
        budget_max: contract.budget_max || null,
        deadline: contract.deadline || null,
        location: contract.location || null,
        category: contract.category || null,
        requirements: contract.requirements || null,
        documents: contract.documents || null,
        updated_at: contract.updated_at || null,
        creator: contract.creator ? {
          full_name: contract.creator.full_name || null,
          avatar_url: contract.creator.avatar_url || null
        } : null
      })) || [];
      
      setContracts(typedData);
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
