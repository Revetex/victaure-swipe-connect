
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, MessageSquare, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface QuickActionsProps {
  onRequestChat: () => void;
}

export function QuickActions({ onRequestChat }: QuickActionsProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-border/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-background/50" 
            onClick={onRequestChat}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Assistance</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-background/50"
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
