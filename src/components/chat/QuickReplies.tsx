
import React from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface QuickReplyProps {
  suggestions: string[];
  onSelect: (reply: string) => void;
}

export function QuickReplies({ suggestions, onSelect }: QuickReplyProps) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-wrap gap-2 mt-2"
      >
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            className="bg-background/80 backdrop-blur-sm hover:bg-primary/10"
          >
            {suggestion}
          </Button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
