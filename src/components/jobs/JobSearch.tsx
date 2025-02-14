
import { GoogleSearch } from "@/components/google-search/GoogleSearch";
import { Card } from "@/components/ui/card";

export function JobSearch() {
  const SEARCH_ENGINE_ID = "1262c5460a0314a80";

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Recherche d'emplois</h2>
      <GoogleSearch searchEngineId={SEARCH_ENGINE_ID} />
    </Card>
  );
}
