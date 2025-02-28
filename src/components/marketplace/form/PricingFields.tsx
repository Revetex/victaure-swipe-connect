
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PricingFieldsProps {
  saleType: string;
  price: string;
  minimumBid: string;
  auctionEndDate: Date | null;
  onChange: (field: string, value: string | Date) => void;
}

export function PricingFields({ saleType, price, minimumBid, auctionEndDate, onChange }: PricingFieldsProps) {
  if (saleType === 'immediate') {
    return (
      <div className="grid gap-2">
        <Label className="text-white">Prix fixe</Label>
        <Input 
          type="number" 
          placeholder="Prix en CAD"
          value={price}
          onChange={(e) => onChange('price', e.target.value)}
          required
          className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label className="text-white">Prix de départ</Label>
        <Input 
          type="number" 
          placeholder="Prix minimal en CAD"
          value={minimumBid}
          onChange={(e) => onChange('minimumBid', e.target.value)}
          required
          className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
        />
      </div>
      <div className="grid gap-2">
        <Label className="text-white">Fin des enchères</Label>
        <Input 
          type="datetime-local"
          value={auctionEndDate?.toISOString().slice(0, 16) || ''}
          onChange={(e) => onChange('auctionEndDate', new Date(e.target.value))}
          required
          className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white"
        />
      </div>
    </div>
  );
}
