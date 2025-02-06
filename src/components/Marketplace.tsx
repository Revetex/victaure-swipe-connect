
import { Card } from "@/components/ui/card";
import { ExternalSearchSection } from "@/components/google-search/ExternalSearchSection";

export function Marketplace() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ExternalSearchSection />
      </Card>
    </div>
  );
}
