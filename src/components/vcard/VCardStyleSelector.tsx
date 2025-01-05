import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyleOption } from "./types";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  isEditing: boolean;
}

export function VCardStyleSelector({
  selectedStyle,
  onStyleSelect,
  isEditing,
}: VCardStyleSelectorProps) {
  if (!isEditing) return null;

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 pb-2">
        {styleOptions.map((style) => (
          <Button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            variant={selectedStyle.id === style.id ? "default" : "outline"}
            className="flex-shrink-0"
          >
            {style.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}

const styleOptions: StyleOption[] = [
  {
    id: "1",
    name: "Modern",
    color: "#3B82F6",
    secondaryColor: "#60A5FA",
    font: "'Inter', sans-serif",
    bgGradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
    borderStyle: "border-blue-200/20",
    colors: {
      text: {
        primary: "text-gray-900 dark:text-gray-100",
        secondary: "text-gray-600 dark:text-gray-400",
      },
    },
  },
  {
    id: "2",
    name: "Classic",
    color: "#4B5563",
    secondaryColor: "#6B7280",
    font: "'Georgia', serif",
    bgGradient: "bg-gradient-to-br from-gray-500/10 to-gray-600/10",
    borderStyle: "border-gray-200/20",
    colors: {
      text: {
        primary: "text-gray-900 dark:text-gray-100",
        secondary: "text-gray-600 dark:text-gray-400",
      },
    },
  },
  {
    id: "3",
    name: "Creative",
    color: "#EC4899",
    secondaryColor: "#F472B6",
    font: "'Poppins', sans-serif",
    bgGradient: "bg-gradient-to-br from-pink-500/10 to-purple-600/10",
    borderStyle: "border-pink-200/20",
    colors: {
      text: {
        primary: "text-gray-900 dark:text-gray-100",
        secondary: "text-gray-600 dark:text-gray-400",
      },
    },
  },
];