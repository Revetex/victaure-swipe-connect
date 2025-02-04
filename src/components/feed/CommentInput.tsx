import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const CommentInput = ({ value, onChange, onSubmit }: CommentInputProps) => {
  return (
    <div className="flex gap-2 mt-4">
      <Input
        placeholder="Ajouter un commentaire..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <Button
        size="icon"
        onClick={onSubmit}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};