
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ListingSelectorsProps {
  type: string;
  condition: string;
  location: string;
  onTypeChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export function ListingSelectors({
  type,
  condition,
  location,
  onTypeChange,
  onConditionChange,
  onLocationChange
}: ListingSelectorsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type d'annonce</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vente">Vente</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="service">Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">État</Label>
        <Select value={condition} onValueChange={onConditionChange}>
          <SelectTrigger>
            <SelectValue placeholder="État du produit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Neuf</SelectItem>
            <SelectItem value="like-new">Comme neuf</SelectItem>
            <SelectItem value="good">Bon état</SelectItem>
            <SelectItem value="fair">État correct</SelectItem>
            <SelectItem value="poor">À rénover</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Ville, Province"
        />
      </div>
    </div>
  );
}
