
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface JobPostingFormProps {}

export function JobPostingForm({}: JobPostingFormProps) {
  return (
    <form className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Type d'annonce</Label>
          <Select defaultValue="job">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type d'annonce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job">Offre d'emploi</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Titre</Label>
          <Input placeholder="Titre de votre annonce" />
        </div>

        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea placeholder="Décrivez votre offre en détail..." className="min-h-[100px]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Localisation</Label>
            <Input placeholder="Ville, région..." />
          </div>

          <div className="grid gap-2">
            <Label>Salaire / Budget</Label>
            <Input type="number" placeholder="Montant" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button type="submit">Publier l'annonce</Button>
        </div>
      </div>
    </form>
  );
}
