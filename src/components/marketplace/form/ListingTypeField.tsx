
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ListingType } from "@/types/marketplace";

interface ListingTypeFieldProps {
  value: ListingType;
  onChange: (value: ListingType) => void;
}

export function ListingTypeField({ value, onChange }: ListingTypeFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-white">Type d'annonce</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
          <SelectValue placeholder="Choisissez le type d'annonce" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vente">Vente</SelectItem>
          <SelectItem value="location">Location</SelectItem>
          <SelectItem value="service">Service</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
