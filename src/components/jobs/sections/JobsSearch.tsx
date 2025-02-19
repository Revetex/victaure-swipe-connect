
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface JobsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function JobsSearch({ searchQuery, onSearchChange }: JobsSearchProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      <Card className="p-6 shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Rechercher par titre, entreprise ou mot-clé..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-base bg-background/50 border-primary/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="outline" size="lg" className="gap-2 h-12 border-primary/20 hover:border-primary">
            <Filter className="h-5 w-5" />
            Filtres avancés
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
