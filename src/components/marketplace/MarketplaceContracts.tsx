
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  DollarSign,
  MapPin,
  Users,
  FileText,
  Gavel,
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketplaceContract {
  id: string;
  title: string;
  description: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  status: string;
  location: string | null;
  currency: string;
  category: string | null;
  requirements: string[] | null;
  created_at: string;
  creator: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

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
          *,
          creator:creator_id (
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

  const formatBudget = (min: number | null, max: number | null, currency: string) => {
    if (min === null && max === null) return "Budget à discuter";
    if (min === null) return `Jusqu'à ${max} ${currency}`;
    if (max === null) return `À partir de ${min} ${currency}`;
    return `${min} - ${max} ${currency}`;
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Aucun contrat disponible</h3>
        <p className="text-muted-foreground mt-2">
          Il n'y a actuellement aucun contrat ouvert aux enchères.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {contracts.map((contract) => (
        <Card key={contract.id} className="overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contract.creator?.avatar_url || ''} />
                    <AvatarFallback>
                      {contract.creator?.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{contract.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {contract.creator?.full_name || 'Utilisateur anonyme'}
                    </p>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="font-medium">
                {contract.category || 'Non catégorisé'}
              </Badge>
            </div>

            <p className="text-muted-foreground">
              {contract.description || 'Aucune description fournie'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{formatBudget(contract.budget_min, contract.budget_max, contract.currency)}</span>
              </div>
              
              {contract.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{contract.location}</span>
                </div>
              )}

              {contract.deadline && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(contract.deadline), 'PPP', { locale: fr })}
                  </span>
                </div>
              )}

              {contract.requirements && contract.requirements.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{contract.requirements.length} prérequis</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                Publié le {format(new Date(contract.created_at), 'PPP', { locale: fr })}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Voir les offres
                </Button>
                <Button size="sm" className="gap-2">
                  <Gavel className="h-4 w-4" />
                  Faire une offre
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
