
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Contract {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: string;
  documents: string[];
  created_at: string;
}

export function ContractsList() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement des contrats...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contracts.map((contract) => (
        <Card key={contract.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="truncate">{contract.title}</span>
              {contract.documents?.length > 0 && (
                <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {contract.description}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Budget:</span>
                <span>{contract.budget_min} - {contract.budget_max} CAD</span>
              </div>
              {contract.deadline && (
                <div className="flex justify-between">
                  <span>Date limite:</span>
                  <span>{format(new Date(contract.deadline), "PP", { locale: fr })}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {/* TODO: Implement contract details view */}}
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir les détails
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
