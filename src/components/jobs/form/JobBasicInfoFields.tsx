import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { quebecCities } from "@/data/cities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobBasicInfoFieldsProps {
  title: string;
  description: string;
  budget: string;
  location: string;
  onChange: (field: string, value: string | number) => void;
}

export function JobBasicInfoFields({ 
  title, 
  description, 
  budget, 
  location, 
  onChange 
}: JobBasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la mission</Label>
          <Input
            id="title"
            placeholder="Ex: Développeur React Senior"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Décrivez la mission en détail"
            value={description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Select
            value={location}
            onValueChange={(value) => onChange("location", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ville..." />
            </SelectTrigger>
            <SelectContent>
              {quebecCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget (CAD)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="Ex: 5000"
            value={budget}
            onChange={(e) => onChange("budget", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}