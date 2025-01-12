import { cn } from "@/lib/utils";

interface VCardContainerProps {
  children: React.ReactNode;
  isEditing?: boolean;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardContainer({ 
  children, 
  isEditing,
  customStyles 
}: VCardContainerProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full p-4 transition-colors",
        isEditing ? "bg-background" : "bg-gradient-to-br from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      )}
      style={{
        fontFamily: customStyles?.font || "inherit",
        backgroundColor: customStyles?.background || undefined,
        color: customStyles?.textColor || undefined,
      }}
    >
      {children}
    </div>
  );
}