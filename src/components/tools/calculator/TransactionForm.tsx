
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { categories, TransactionType } from "./types";

interface TransactionFormProps {
  currentType: TransactionType;
  title: string;
  category: string;
  description: string;
  amount: string;
  recipientId: string;
  freezePeriod: string;
  minimumBid: string;
  auctionEndDate: string;
  enableAlerts: boolean;
  isProcessing: boolean;
  onTypeChange: (type: TransactionType) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRecipientIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFreezePeriodChange: (value: string) => void;
  onMinimumBidChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAuctionEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAlertsChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TransactionForm({
  currentType,
  title,
  category,
  description,
  amount,
  recipientId,
  freezePeriod,
  minimumBid,
  auctionEndDate,
  enableAlerts,
  isProcessing,
  onTypeChange,
  onTitleChange,
  onCategoryChange,
  onDescriptionChange,
  onAmountChange,
  onRecipientIdChange,
  onFreezePeriodChange,
  onMinimumBidChange,
  onAuctionEndDateChange,
  onAlertsChange,
  onSubmit
}: TransactionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <RadioGroup value={currentType} onValueChange={onTypeChange}>
        <div className="grid grid-cols-3 gap-4">
          {['fixed', 'auction', 'escrow'].map((type) => (
            <div 
              key={type}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all
                ${currentType === type ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/20'}
              `}
              onClick={() => onTypeChange(type as TransactionType)}
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
            onChange={onTitleChange}
            placeholder="ex: iPhone 13 Pro Max - 256GB"
            maxLength={100}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={onCategoryChange}>
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
            onChange={onDescriptionChange}
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
                onChange={onRecipientIdChange}
                placeholder="ID du destinataire"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Période de Gel</Label>
              <RadioGroup 
                value={freezePeriod} 
                onValueChange={onFreezePeriodChange}
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
              onChange={onAmountChange}
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
                onChange={onMinimumBidChange}
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
                onChange={onAuctionEndDateChange}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={enableAlerts}
                onCheckedChange={onAlertsChange}
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
            currentType === 'escrow' ? 'Créer le paiement en fiducie' :
            currentType === 'auction' ? 'Créer l\'enchère' :
            'Créer l\'annonce'
          )}
        </Button>
      </div>
    </form>
  );
}
