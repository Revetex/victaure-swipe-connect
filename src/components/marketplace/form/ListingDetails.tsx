
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ListingDetailsProps {
  title: string;
  description: string;
  price: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
}

export function ListingDetails({ 
  title, 
  description, 
  price, 
  onTitleChange, 
  onDescriptionChange, 
  onPriceChange 
}: ListingDetailsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'annonce</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          maxLength={100}
          placeholder="ex: iPhone 13 Pro Max - 256GB"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          required
          className="min-h-[100px]"
          placeholder="Décrivez votre article, son état, ses caractéristiques..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          required
        />
      </div>
    </>
  );
}
