
import { GoogleSearch } from "@/components/google-search/GoogleSearch";
import { Card } from "@/components/ui/card";

export function JobSearch() {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Recherche d'emplois</h2>
      <GoogleSearch />
    </Card>
  );
}
