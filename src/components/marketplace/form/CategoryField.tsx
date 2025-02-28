
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ListingType } from "@/types/marketplace";

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  categories?: {id: string, name: string, type: string}[];
  listingType: ListingType;
}

export function CategoryField({ value, onChange, categories = [], listingType }: CategoryFieldProps) {
  // Filtrer les catégories selon le type d'annonce sélectionné
  const filteredCategories = categories.filter(cat => 
    cat.type === 'all' || cat.type === listingType
  );

  return (
    <div className="grid gap-2">
      <Label className="text-white">Catégorie</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white">
          <SelectValue placeholder="Choisissez une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))
          ) : (
            // Catégories par défaut si aucune n'est trouvée dans la base de données
            <>
              <SelectItem value="electronics">Électronique</SelectItem>
              <SelectItem value="furniture">Mobilier</SelectItem>
              <SelectItem value="clothing">Vêtements</SelectItem>
              <SelectItem value="vehicles">Véhicules</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="immobilier">Immobilier</SelectItem>
              <SelectItem value="emploi">Emploi</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
