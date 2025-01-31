import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobCard } from "./jobs/JobCard";

export function Marketplace() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Emplois disponibles</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 h-8 px-2">
                <SlidersHorizontal className="h-3 w-3" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <Label>Type de contrat</Label>
                    <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">Tous</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cdi" id="cdi" />
                        <Label htmlFor="cdi">CDI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cdd" id="cdd" />
                        <Label htmlFor="cdd">CDD</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="internship" id="internship" />
                        <Label htmlFor="internship">Stage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelance" id="freelance" />
                        <Label htmlFor="freelance">Freelance</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label>Localisation</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paris">Paris</SelectItem>
                        <SelectItem value="lyon">Lyon</SelectItem>
                        <SelectItem value="marseille">Marseille</SelectItem>
                        <SelectItem value="bordeaux">Bordeaux</SelectItem>
                        <SelectItem value="toulouse">Toulouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Salaire minimum</Label>
                    <Select value={selectedSalary} onValueChange={setSelectedSalary}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un salaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20k">20 000 €</SelectItem>
                        <SelectItem value="30k">30 000 €</SelectItem>
                        <SelectItem value="40k">40 000 €</SelectItem>
                        <SelectItem value="50k">50 000 €</SelectItem>
                        <SelectItem value="60k">60 000 €</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote"
                      checked={remoteOnly}
                      onCheckedChange={(checked) => setRemoteOnly(checked as boolean)}
                    />
                    <Label htmlFor="remote">Télétravail uniquement</Label>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <JobCard
            title="Développeur Frontend"
            company="TechCorp"
            location="Paris"
            type="CDI"
            salary="45-55k"
            remote={true}
          />
          <JobCard
            title="UX Designer"
            company="DesignStudio"
            location="Lyon"
            type="CDI"
            salary="40-50k"
            remote={false}
          />
          <JobCard
            title="Product Manager"
            company="StartupXYZ"
            location="Bordeaux"
            type="CDD"
            salary="50-60k"
            remote={true}
          />
        </div>
      </div>
    </div>
  );
}