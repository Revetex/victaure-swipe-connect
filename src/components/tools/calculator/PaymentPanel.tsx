
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Instructions } from "./Instructions";
import { TransactionForm } from "./TransactionForm";
import { AuctionsList } from "./AuctionsList";
import type { TransactionType, FilterOrder } from "./types";

export function PaymentPanel() {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [freezePeriod, setFreezePeriod] = useState("24");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentType, setCurrentType] = useState<TransactionType>('fixed');
  const [auctionEndDate, setAuctionEndDate] = useState<string>("");
  const [minimumBid, setMinimumBid] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [activeAuctions, setActiveAuctions] = useState<any[]>([]);
  const [priceFilter, setPriceFilter] = useState<FilterOrder>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
    toast.info(`Mode ${newType} sélectionné`);
  };

  const initiateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      switch (currentType) {
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
      {showInstructions && (
        <Instructions
          currentType={currentType}
          onHide={() => setShowInstructions(false)}
        />
      )}
      
      <TransactionForm
        currentType={currentType}
        title={title}
        category={category}
        description={description}
        amount={amount}
        recipientId={recipientId}
        freezePeriod={freezePeriod}
        minimumBid={minimumBid}
        auctionEndDate={auctionEndDate}
        enableAlerts={enableAlerts}
        isProcessing={isProcessing}
        onTypeChange={handleTypeChange}
        onTitleChange={(e) => setTitle(e.target.value)}
        onCategoryChange={setCategory}
        onDescriptionChange={(e) => setDescription(e.target.value)}
        onAmountChange={(e) => setAmount(e.target.value)}
        onRecipientIdChange={(e) => setRecipientId(e.target.value)}
        onFreezePeriodChange={setFreezePeriod}
        onMinimumBidChange={(e) => setMinimumBid(e.target.value)}
        onAuctionEndDateChange={(e) => setAuctionEndDate(e.target.value)}
        onAlertsChange={setEnableAlerts}
        onSubmit={initiateTransaction}
      />

      <AuctionsList
        activeAuctions={activeAuctions}
        categoryFilter={categoryFilter}
        priceFilter={priceFilter}
        onCategoryFilterChange={setCategoryFilter}
        onPriceFilterChange={setPriceFilter}
      />
    </Card>
  );
}
