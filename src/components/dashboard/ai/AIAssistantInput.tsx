import { Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface AIAssistantInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AIAssistantInput({ input, isLoading, onInputChange, onSubmit }: AIAssistantInputProps) {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Posez vos questions à M. Victaure..."
          className="flex-1 bg-background/50 backdrop-blur-sm"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Search className="h-4 w-4" />
            </motion.div>
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}