
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ListingDetailsProps {
  title: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

export function ListingDetails({ title, description, onChange }: ListingDetailsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label className="text-white">Titre de l'annonce</Label>
        <Input 
          placeholder="Titre de votre annonce" 
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
          required
          className="bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-white">Description</Label>
        <Textarea 
          placeholder="Décrivez votre article en détail..." 
          className="min-h-[100px] bg-[#1B2A4A] border-[#64B5D9]/10 text-white placeholder:text-white/50"
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          required
        />
      </div>
    </>
  );
}
