import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  onNewConversation: () => void;
}

export function SearchHeader({ onNewConversation }: SearchHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-end">
      <Button 
        variant="default" 
        onClick={onNewConversation}
        size="sm"
        className="whitespace-nowrap"
      >
        Nouvelle conversation
      </Button>
    </div>
  );
}