
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function ConversationSearch({ onSearch, isSearching }: ConversationSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className={`h-4 w-4 ${isSearching ? 'text-[#64B5D9]' : 'text-[#F2EBE4]/50'}`} />
      </div>
      
      <Input
        type="text"
        placeholder="Rechercher une conversation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10 bg-[#1A2335] border-[#64B5D9]/10 text-[#F2EBE4] placeholder-[#F2EBE4]/40 
                  focus-visible:ring-[#64B5D9]/20 focus-visible:border-[#64B5D9]/30"
      />
      
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#F2EBE4]/60 hover:text-[#F2EBE4] hover:bg-[#64B5D9]/10"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
