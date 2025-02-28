
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
      const { data: contractsData, error: contractsError } = await supabase
        .from('mv_marketplace_contracts')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      const typedContracts: MarketplaceContract[] = (contractsData || []).map(contract => ({
        id: contract.id,
        title: contract.title,
        description: contract.description || "",
        budget_min: contract.budget_min || undefined,
        budget_max: contract.budget_max || undefined,
        deadline: contract.deadline || undefined,
        status: contract.status,
        location: contract.location || undefined,
        currency: contract.currency || "CAD",
        category: contract.category || undefined,
        requirements: contract.requirements || [],
        documents: contract.documents || [],
        created_at: contract.created_at,
        updated_at: contract.updated_at || undefined,
        creator_id: contract.creator_id,
        creator: {
          full_name: contract.creator_full_name || null,
          avatar_url: contract.creator_avatar_url || null
        }
      }));
      
      setContracts(typedContracts);
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
