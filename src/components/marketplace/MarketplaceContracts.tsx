
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
      // Requête séparée pour obtenir les contrats et leurs créateurs
      const { data: contractsData, error: contractsError } = await supabase
        .from('marketplace_contracts')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      // Pour chaque contrat, récupérer les informations du créateur
      const contractsWithCreators: MarketplaceContract[] = await Promise.all(
        (contractsData || []).map(async (contract) => {
          const { data: creatorData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', contract.creator_id)
            .single();

          return {
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
            creator: creatorData ? {
              full_name: creatorData.full_name || null,
              avatar_url: creatorData.avatar_url || null
            } : null
          };
        })
      );
      
      setContracts(contractsWithCreators);
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
