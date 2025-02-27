
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryField({ value, onChange }: CategoryFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-white">Catégorie</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
          <SelectValue placeholder="Choisissez une catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electronics">Électronique</SelectItem>
          <SelectItem value="furniture">Mobilier</SelectItem>
          <SelectItem value="clothing">Vêtements</SelectItem>
          <SelectItem value="vehicles">Véhicules</SelectItem>
          <SelectItem value="services">Services</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
