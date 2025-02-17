
import React from 'react';

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function QuickReplies({ suggestions, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="text-sm px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
