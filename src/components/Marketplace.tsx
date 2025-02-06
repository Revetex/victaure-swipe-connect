
import { Card } from "@/components/ui/card";
import { ExternalSearchSection } from "@/components/google-search/ExternalSearchSection";

export function Marketplace() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Recherchez des offres d'emploi, des services et des produits
            </p>
          </div>
          <ExternalSearchSection />
        </div>
      </Card>
    </div>
  );
}
