import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ExternalSearchSection } from "@/components/jobs/sections/ExternalSearchSection";

export function Marketplace() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [isExternalSearchLoading, setIsExternalSearchLoading] = useState(false);
  const [hasExternalSearchError, setHasExternalSearchError] = useState(false);

  const handleRetryExternalSearch = () => {
    setHasExternalSearchError(false);
  };

  const handleSearch = () => {
    // This will be implemented with the search functionality
    console.log("Search params:", {
      type: selectedType,
      location: selectedLocation,
      salary: selectedSalary,
      industry: selectedIndustry,
      experience: selectedExperience,
      remote: remoteOnly,
      urgent: urgentOnly,
      term: searchTerm
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Emplois disponibles</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un emploi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                    <SlidersHorizontal className="h-4 w-4" />
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
                            <SelectItem value="montreal">Montréal</SelectItem>
                            <SelectItem value="quebec">Québec</SelectItem>
                            <SelectItem value="laval">Laval</SelectItem>
                            <SelectItem value="gatineau">Gatineau</SelectItem>
                            <SelectItem value="sherbrooke">Sherbrooke</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Industrie</Label>
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une industrie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech">Technologie</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="health">Santé</SelectItem>
                            <SelectItem value="education">Éducation</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Expérience</Label>
                        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                          <SelectTrigger>
                            <SelectValue placeholder="Niveau d'expérience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire (2-5 ans)</SelectItem>
                            <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                            <SelectItem value="expert">Expert (8+ ans)</SelectItem>
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
                            <SelectItem value="30k">30 000 $</SelectItem>
                            <SelectItem value="40k">40 000 $</SelectItem>
                            <SelectItem value="50k">50 000 $</SelectItem>
                            <SelectItem value="60k">60 000 $</SelectItem>
                            <SelectItem value="70k">70 000 $</SelectItem>
                            <SelectItem value="80k">80 000 $</SelectItem>
                            <SelectItem value="90k">90 000 $</SelectItem>
                            <SelectItem value="100k">100 000 $</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remote"
                            checked={remoteOnly}
                            onCheckedChange={(checked) => setRemoteOnly(checked as boolean)}
                          />
                          <Label htmlFor="remote">Télétravail uniquement</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="urgent"
                            checked={urgentOnly}
                            onCheckedChange={(checked) => setUrgentOnly(checked as boolean)}
                          />
                          <Label htmlFor="urgent">Offres urgentes uniquement</Label>
                        </div>
                      </div>

                      <Button className="w-full" onClick={handleSearch}>
                        Appliquer les filtres
                      </Button>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="w-full">
            <ExternalSearchSection
              isLoading={isExternalSearchLoading}
              hasError={hasExternalSearchError}
              onRetry={handleRetryExternalSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}