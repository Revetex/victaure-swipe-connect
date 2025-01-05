import { StickyNote } from "@/types/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface NotesSectionProps {
  notes: StickyNote[];
  newNote: string;
  selectedColor: string;
  onNoteChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const colors = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "pink", label: "Rose", class: "bg-pink-200" },
];

export function NotesSection({
  notes,
  newNote,
  selectedColor,
  onNoteChange,
  onColorChange,
  onAdd,
  onDelete,
}: NotesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nouvelle note..."
              value={newNote}
              onChange={(e) => onNoteChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onAdd();
                }
              }}
            />
            <Button onClick={onAdd}>Ajouter</Button>
          </div>

          <RadioGroup
            value={selectedColor}
            onValueChange={onColorChange}
            className="flex gap-4"
          >
            {colors.map((color) => (
              <div key={color.value} className="flex items-center space-x-2">
                <RadioGroupItem value={color.value} id={color.value} />
                <Label
                  htmlFor={color.value}
                  className={`w-4 h-4 rounded-full ${color.class}`}
                />
              </div>
            ))}
          </RadioGroup>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-lg shadow-md ${
                  colors.find((c) => c.value === note.color)?.class
                }`}
              >
                <p className="text-gray-800">{note.text}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => onDelete(note.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}