import { ScrollArea } from "@/components/ui/scroll-area";

interface ChessMoveHistoryProps {
  moveHistory: string[];
}

export function ChessMoveHistory({ moveHistory }: ChessMoveHistoryProps) {
  return (
    <div className="mt-4 p-4 bg-muted rounded-lg max-h-32">
      <h3 className="font-medium mb-2">Move History:</h3>
      <ScrollArea className="h-24">
        {moveHistory.map((move, index) => (
          <div key={index} className="text-sm text-muted-foreground">
            {index + 1}. {move}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}