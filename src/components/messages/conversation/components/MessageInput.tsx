
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FormEvent } from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-4 border-t">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          placeholder="Écrire un message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
