
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SaleTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SaleTypeField({ value, onChange }: SaleTypeFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-white">Type de vente</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
          <SelectValue placeholder="Choisissez le type de vente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="immediate">Prix immédiat</SelectItem>
          <SelectItem value="auction">Enchères</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
