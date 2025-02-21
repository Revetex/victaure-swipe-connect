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

type TransactionType = 'escrow' | 'auction' | 'fixed';
type FilterOrder = 'asc' | 'desc';

const marketingDescriptions = {
  escrow: {
    title: "Paiement Sécurisé en Fiducie 🔒",
    description: "Protégez vos transactions avec notre système de paiement en fiducie. Les fonds sont sécurisés jusqu'à la livraison du service ou du produit.",
    features: [
      "Protection acheteur et vendeur",
      "Période de gel personnalisable",
      "Traçabilité complète",
      "Remboursement automatique si conditions non remplies"
    ]
  },
  auction: {
    title: "Système d'Enchères en Temps Réel ⚡",
    description: "Créez des enchères dynamiques et engageantes. Idéal pour maximiser la valeur de vos biens ou services.",
    features: [
      "Notifications en temps réel",
      "Historique des enchères",
      "Prix de réserve",
      "Durée flexible"
    ]
  },
  fixed: {
    title: "Prix Fixe Simple et Efficace 💰",
    description: "Vendez rapidement à prix fixe. La solution parfaite pour les transactions immédiates.",
    features: [
      "Transaction rapide",
      "Prix transparent",
      "Paiement immédiat",
      "Sans commission"
    ]
  }
};

const categories = [
  { id: 'tech', name: 'Technologie', description: 'Matériel informatique, logiciels, etc.' },
  { id: 'services', name: 'Services', description: 'Prestations professionnelles' },
  { id: 'goods', name: 'Biens', description: 'Produits physiques' },
  { id: 'other', name: 'Autre', description: 'Autres types de produits/services' }
];

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
  const [currentType, setCurrentType] = useState<TransactionType>('fixed');
  const [showInstructions, setShowInstructions] = useState(true);

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

  const handleTypeChange = (newType: TransactionType) => {
    setCurrentType(newType);
    setShowInstructions(true);
    toast.info(`Mode ${marketingDescriptions[newType].title} sélectionné`, {
      description: "Consultez les instructions pour plus de détails"
    });
  };

  const renderInstructions = () => (
    <Card className="p-4 bg-primary/5 mb-4">
      <h3 className="font-semibold mb-2">{marketingDescriptions[currentType].title}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {marketingDescriptions[currentType].description}
      </p>
      <div className="space-y-2">
        <h4 className="font-medium">Fonctionnalités :</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {marketingDescriptions[currentType].features.map((feature, index) => (
            <li key={index} className="text-muted-foreground">{feature}</li>
          ))}
        </ul>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-4"
        onClick={() => setShowInstructions(false)}
      >
        Masquer les instructions
      </Button>
    </Card>
  );

  const renderForm = () => (
    <form onSubmit={initiateTransaction} className="space-y-4">
      <RadioGroup value={currentType} onValueChange={handleTypeChange}>
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(marketingDescriptions).map((type) => (
            <div 
              key={type}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                ${currentType === type ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/20'}
              `}
              onClick={() => handleTypeChange(type as TransactionType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type} className="cursor-pointer">
                  {type === 'fixed' ? 'Prix fixe' : type === 'auction' ? 'Enchère' : 'Fiducie'}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="grid gap-6 mt-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Titre de l'annonce
            <span className="text-xs text-muted-foreground ml-2">
              (Max 100 caractères)
            </span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: iPhone 13 Pro Max - 256GB"
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {category && (
            <p className="text-sm text-muted-foreground mt-1">
              {categories.find(cat => cat.id === category)?.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description détaillée
            <span className="text-xs text-muted-foreground ml-2">
              (Soyez précis et exhaustif)
            </span>
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez en détail votre produit/service..."
            className="w-full min-h-[150px] p-3 rounded-md border"
            required
          />
        </div>

        {currentType === 'escrow' && (
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

        {(currentType === 'fixed' || currentType === 'escrow') && (
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

        {currentType === 'auction' && (
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
          className="w-full mt-6"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin border-2 border-white/20 border-t-white rounded-full" />
              Traitement en cours...
            </>
          ) : (
            marketingDescriptions[currentType].title
          )}
        </Button>
      </div>
    </form>
  );

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
      {showInstructions && renderInstructions()}
      {renderForm()}

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Enchères en cours</h3>
            <p className="text-sm text-muted-foreground">
              {activeAuctions.length} enchères actives
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={priceFilter} 
              onValueChange={(value: FilterOrder) => setPriceFilter(value)}
            >
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

        <div className="grid gap-4">
          {activeAuctions.map((auction) => (
            <Card key={auction.id} className="p-4 hover:bg-accent/5 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-lg">{auction.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {auction.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Prix actuel:
                      </span>
                      <span className="text-primary font-bold">
                        {auction.current_price || auction.price} CAD
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {auction.bids?.length || 0} enchères
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Fin: {new Date(auction.auction_end_date).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
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
