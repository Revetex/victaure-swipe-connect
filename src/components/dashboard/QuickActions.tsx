
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, MessageSquare, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export interface QuickActionsProps {
  onRequestChat: () => void;
}

export function QuickActions({ onRequestChat }: QuickActionsProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            className="w-full justify-between" 
            onClick={onRequestChat}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Parler à l'assistant</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" className="w-full justify-between">
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
