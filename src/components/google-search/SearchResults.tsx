
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface SearchResultsProps {
  isEnhancing: boolean;
  onEnhance: () => void;
}

export function SearchResults({ isEnhancing, onEnhance }: SearchResultsProps) {
  return (
    <Card className="bg-background/50 relative">
      <Button
        onClick={onEnhance}
        disabled={isEnhancing}
        variant="outline"
        className="text-xs absolute top-4 right-4 z-10"
      >
        {isEnhancing ? 'Analyse en cours...' : 'Analyser avec IA'}
      </Button>
      
      <ScrollArea className="h-[400px]">
        <div className="p-4">
          <div className="gcse-searchresults-only"></div>
        </div>
      </ScrollArea>
    </Card>
  );
}
