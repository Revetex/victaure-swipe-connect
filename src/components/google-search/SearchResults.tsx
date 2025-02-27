
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface SearchResultsProps {
  isEnhancing: boolean;
  onEnhance: () => void;
}

export function SearchResults({ isEnhancing, onEnhance }: SearchResultsProps) {
  return (
    <Card className="bg-background/50 rounded-lg p-6">
      <div className="flex justify-end mb-4">
        <Button
          onClick={onEnhance}
          disabled={isEnhancing}
          variant="outline"
          className="text-xs"
        >
          {isEnhancing ? 'Analyse en cours...' : 'Analyser avec IA'}
        </Button>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="gcse-searchresults-only"></div>
      </ScrollArea>
    </Card>
  );
}
