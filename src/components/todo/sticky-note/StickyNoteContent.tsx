
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface StickyNoteContentProps {
  text: string;
  isEditing: boolean;
  onTextChange: (text: string) => void;
  created_at?: string;
}

export function StickyNoteContent({ 
  text, 
  isEditing, 
  onTextChange,
  created_at 
}: StickyNoteContentProps) {
  return (
    <div className="w-full">
      {isEditing ? (
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="min-h-[100px] bg-transparent border-none focus-visible:ring-1 focus-visible:ring-black/20 resize-none"
          autoFocus
        />
      ) : (
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {text}
        </p>
      )}
      
      {created_at && (
        <div className="mt-4 text-xs text-muted-foreground/70">
          <time dateTime={created_at}>
            {new Date(created_at).toLocaleString('fr-FR')}
          </time>
        </div>
      )}
    </div>
  );
}
