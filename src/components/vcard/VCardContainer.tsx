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
    <div className={cn(
      "relative min-h-screen w-full p-4",
      isEditing ? "bg-background" : ""
    )}>
      <div 
        className="space-y-8"
        style={{
          fontFamily: customStyles?.font || "inherit",
          color: customStyles?.textColor || undefined,
        }}
      >
        <div 
          className="rounded-xl p-6"
          style={{
            backgroundColor: customStyles?.background || undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}