import { ReactNode } from "react";

interface VCardContainerProps {
  children: ReactNode;
  isEditing: boolean;
  customStyles?: {
    font?: string | null;
    background?: string | null;
    textColor?: string | null;
  };
}

export function VCardContainer({ children, isEditing, customStyles }: VCardContainerProps) {
  return (
    <div 
      className={`relative w-full min-h-screen bg-background text-foreground transition-colors ${
        isEditing ? 'pb-32' : ''
      }`}
      style={{
        fontFamily: customStyles?.font || 'inherit',
        backgroundColor: customStyles?.background || 'var(--background)',
        color: customStyles?.textColor || 'var(--foreground)'
      }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}