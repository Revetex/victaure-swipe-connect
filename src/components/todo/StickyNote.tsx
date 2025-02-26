
import { useState } from "react";
import type { StickyNote as StickyNoteType } from "@/types/todo";
import { StickyNoteContent } from "./sticky-note/StickyNoteContent";
import { StickyNoteActions } from "./sticky-note/StickyNoteActions";
import { StickyNoteWrapper } from "./sticky-note/StickyNoteWrapper";

interface StickyNoteProps {
  note: StickyNoteType;
  onDelete: (id: string) => void;
  onUpdate?: (note: StickyNoteType) => void;
  layout?: 'grid' | 'masonry' | 'list';
  isDraggable?: boolean;
}

export function StickyNote({ 
  note, 
  onDelete, 
  onUpdate, 
  layout = 'grid',
  isDraggable = false 
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });

  const handleDragEnd = (event: any, info: any) => {
    if (!onUpdate || !isDraggable) return;
    
    const container = document.querySelector('.notes-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const noteRect = event.target.getBoundingClientRect();

    let newX = position.x + info.offset.x;
    let newY = position.y + info.offset.y;

    newX = Math.max(0, Math.min(newX, containerRect.width - noteRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - noteRect.height));

    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onUpdate({
      ...note,
      position: newPosition
    });
  };

  const handleSave = () => {
    if (!onUpdate) return;
    
    onUpdate({
      ...note,
      text: editedText
    });
    setIsEditing(false);
  };

  const handleResize = (e: any, { size }: { size: { width: number; height: number } }) => {
    if (!onUpdate) return;
    
    onUpdate({
      ...note,
      metadata: {
        ...note.metadata,
        width: size.width,
        height: size.height
      }
    });
  };

  const width = note.metadata?.width || 280;
  const height = note.metadata?.height || 280;

  return (
    <StickyNoteWrapper
      note={note}
      position={position}
      isDraggable={isDraggable}
      layout={layout}
      width={width}
      height={height}
      onDragEnd={handleDragEnd}
      onResize={handleResize}
    >
      <div className="flex justify-between items-start w-full gap-2">
        <StickyNoteContent
          text={editedText}
          isEditing={isEditing}
          onTextChange={setEditedText}
          created_at={note.created_at}
        />
        
        <StickyNoteActions
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onDelete={() => onDelete(note.id)}
        />
      </div>
    </StickyNoteWrapper>
  );
}
