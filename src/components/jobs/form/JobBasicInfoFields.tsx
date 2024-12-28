import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JobBasicInfoFieldsProps {
  title: string;
  description: string;
  budget: string;
  location: string;
  onChange: (field: string, value: string) => void;
}

export function JobBasicInfoFields({
  title,
  description,
  budget,
  location,
  onChange,
}: JobBasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => onChange("budget", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onChange("location", e.target.value)}
          required
        />
      </div>
    </>
  );
}