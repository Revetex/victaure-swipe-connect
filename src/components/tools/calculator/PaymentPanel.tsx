
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function PaymentPanel() {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [freezePeriod, setFreezePeriod] = useState("24");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionType, setTransactionType] = useState<'escrow' | 'auction' | 'fixed'>('fixed');
  const [auctionEndDate, setAuctionEndDate] = useState<string>("");
  const [minimumBid, setMinimumBid] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [activeAuctions, setActiveAuctions] = useState<any[]>([]);
  const [priceFilter, setPriceFilter] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Charger les enchères actives
  useEffect(() => {
    loadActiveAuctions();
  }, [priceFilter, categoryFilter]);

  const loadActiveAuctions = async () => {
    try {
      let query = supabase
        .from('marketplace_services')
        .select(`
          *,
          provider:provider_id(full_name, avatar_url),
          bids:service_bids(*)
        `)
        .eq('type', 'auction')
        .gt('auction_end_date', new Date().toISOString());

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const sortedAuctions = data.sort((a, b) => {
        if (priceFilter === 'asc') {
          return a.price - b.price;
        }
        return b.price - a.price;
      });

      setActiveAuctions(sortedAuctions);
    } catch (error) {
      console.error('Error loading auctions:', error);
      toast.error("Erreur lors du chargement des enchères");
    }
  };

  const initiateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      switch (transactionType) {
        case 'auction':
          const { data: auction, error: auctionError } = await supabase
            .from('marketplace_services')
            .insert({
              provider_id: user.id,
              title,
              description,
              type: "auction",
              price: Number(minimumBid),
              currency: "CAD",
              auction_end_date: new Date(auctionEndDate).toISOString(),
              category
            })
            .select()
            .single();

          if (auctionError) throw auctionError;

          if (enableAlerts) {
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'auction_created',
              title: 'Nouvelle enchère créée',
              message: `Votre enchère "${title}" a été créée avec succès`
            });
          }
          
          toast.success("Enchère créée avec succès");
          break;

        case 'fixed':
          const { data: listing, error: listingError } = await supabase
            .from('marketplace_services')
            .insert({
              provider_id: user.id,
              title,
              description,
              type: "fixed",
              price: Number(amount),
              currency: "CAD",
              category
            })
            .select()
            .single();

          if (listingError) throw listingError;
          
          toast.success("Annonce à prix fixe créée avec succès");
          break;

        case 'escrow':
          const { data: escrow, error: escrowError } = await supabase
            .from('payment_escrows')
            .insert({
              payer_id: user.id,
              payee_id: recipientId,
              amount: Number(amount),
              release_conditions: {
                freeze_period_hours: Number(freezePeriod),
                release_date: new Date(Date.now() + Number(freezePeriod) * 3600000).toISOString()
              }
            })
            .select()
            .single();

          if (escrowError) throw escrowError;
          toast.success(`Paiement en fiducie créé avec succès`);
          break;
      }

      // Reset form
      setAmount("");
      setRecipientId("");
      setAuctionEndDate("");
      setMinimumBid("");
      setTitle("");
      setDescription("");

    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <form onSubmit={initiateTransaction} className="space-y-4">
        <RadioGroup value={transactionType} onValueChange={(value: 'escrow' | 'auction' | 'fixed') => setTransactionType(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Prix fixe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auction" id="auction" />
            <Label htmlFor="auction">Enchère</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="escrow" id="escrow" />
            <Label htmlFor="escrow">Paiement en fiducie</Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'annonce"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technologie</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="goods">Biens</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée"
            className="w-full min-h-[100px] p-2 border rounded-md"
            required
          />
        </div>

        {transactionType === 'escrow' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipientId">ID du Destinataire</Label>
              <Input
                id="recipientId"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="ID du destinataire"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Période de Gel</Label>
              <RadioGroup 
                value={freezePeriod} 
                onValueChange={setFreezePeriod}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24" id="24h" />
                  <Label htmlFor="24h">24 heures</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="72" id="72h" />
                  <Label htmlFor="72h">72 heures</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="168" id="7d" />
                  <Label htmlFor="7d">7 jours</Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

        {(transactionType === 'fixed' || transactionType === 'escrow') && (
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (CAD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        )}

        {transactionType === 'auction' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="minimumBid">Enchère minimum (CAD)</Label>
              <Input
                id="minimumBid"
                type="number"
                value={minimumBid}
                onChange={(e) => setMinimumBid(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auctionEnd">Fin des enchères</Label>
              <Input
                id="auctionEnd"
                type="datetime-local"
                value={auctionEndDate}
                onChange={(e) => setAuctionEndDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={enableAlerts}
                onCheckedChange={setEnableAlerts}
                id="alerts"
              />
              <Label htmlFor="alerts">Activer les alertes</Label>
            </div>
          </>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin border-2 border-white/20 border-t-white rounded-full" />
              Traitement en cours...
            </>
          ) : transactionType === 'escrow' ? (
            'Créer le paiement en fiducie'
          ) : transactionType === 'auction' ? (
            'Créer l\'enchère'
          ) : (
            'Créer l\'annonce'
          )}
        </Button>
      </form>

      {/* Liste des enchères actives */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Enchères en cours</h3>
          <div className="flex items-center gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="tech">Technologie</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="goods">Biens</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter as any}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Prix croissant</SelectItem>
                <SelectItem value="desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {activeAuctions.map((auction) => (
            <Card key={auction.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{auction.title}</h4>
                  <p className="text-sm text-muted-foreground">{auction.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Prix actuel: {auction.current_price || auction.price} CAD
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {auction.bids?.length || 0} enchères
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Fin: {new Date(auction.auction_end_date).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                  >
                    Enchérir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
