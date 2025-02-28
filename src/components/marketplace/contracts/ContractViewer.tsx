
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContractViewerProps {
  contractId: string;
}

interface Contract {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: string;
  documents: string[];
  creator_id: string;
}

interface Bid {
  id: string;
  amount: number;
  proposal: string;
  created_at: string;
  bidder_id: string;
}

export function ContractViewer({ contractId }: ContractViewerProps) {
  const { user } = useUser();
  const [contract, setContract] = useState<Contract | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  useEffect(() => {
    fetchContract();
    fetchBids();
  }, [contractId]);

  const fetchContract = async () => {
    const { data, error } = await supabase
      .from("marketplace_contracts")
      .select("*")
      .eq("id", contractId)
      .single();

    if (error) {
      console.error("Error fetching contract:", error);
      return;
    }

    setContract(data);
  };

  const fetchBids = async () => {
    const { data, error } = await supabase
      .from("contract_bids")
      .select("*")
      .eq("contract_id", contractId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bids:", error);
      return;
    }

    setBids(data);
  };

  const handleBid = async () => {
    if (!user || !contract) return;

    try {
      const amount = parseFloat(bidAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Montant invalide");
        return;
      }

      const { error } = await supabase
        .from("contract_bids")
        .insert({
          contract_id: contractId,
          bidder_id: user.id,
          amount,
          proposal: bidProposal,
          status: "pending"
        });

      if (error) throw error;

      toast.success("Offre soumise avec succès");
      setShowBidDialog(false);
      setBidAmount("");
      setBidProposal("");
      fetchBids();
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Erreur lors de la soumission de l'offre");
    }
  };

  if (!contract) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{contract.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{contract.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Budget:</span>
                <span className="ml-2">{contract.budget_min} - {contract.budget_max} CAD</span>
              </div>
              {contract.deadline && (
                <div>
                  <span className="font-medium">Date limite:</span>
                  <span className="ml-2">
                    {format(new Date(contract.deadline), "PP", { locale: fr })}
                  </span>
                </div>
              )}
            </div>

            {contract.documents && contract.documents.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Documents</h3>
                <div className="grid gap-2">
                  {contract.documents.map((doc, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex items-center justify-between w-full"
                      onClick={() => setSelectedPdf(doc)}
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Document {index + 1}</span>
                      </div>
                      <Download className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {user && user.id !== contract.creator_id && (
              <Button
                className="w-full mt-4"
                onClick={() => setShowBidDialog(true)}
              >
                Faire une offre
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {bids.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Offres ({bids.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{bid.amount} CAD</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {bid.proposal}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(bid.created_at), "PP", { locale: fr })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faire une offre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Montant (CAD)</label>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Proposition</label>
              <Textarea
                value={bidProposal}
                onChange={(e) => setBidProposal(e.target.value)}
                placeholder="Décrivez votre proposition..."
                className="min-h-[100px]"
              />
            </div>
            <Button className="w-full" onClick={handleBid}>
              Soumettre l'offre
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Visualisation du document</DialogTitle>
          </DialogHeader>
          {selectedPdf && (
            <iframe
              src={selectedPdf}
              className="w-full h-full"
              title="PDF Viewer"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
