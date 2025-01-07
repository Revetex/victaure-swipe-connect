interface CustomStyles {
  font?: string | null;
  background?: string | null;
  textColor?: string | null;
}

interface VCardContainerProps {
  children: React.ReactNode;
  isEditing: boolean;
  customStyles?: CustomStyles;
}

export function VCardContainer({ children, isEditing, customStyles }: VCardContainerProps) {
  const containerStyle: React.CSSProperties = {
    fontFamily: customStyles?.font || undefined,
    backgroundColor: customStyles?.background || undefined,
    color: customStyles?.textColor || undefined,
  };

  return (
    <div 
      className={`
        relative p-3 sm:p-6 rounded-xl shadow-lg bg-card 
        ${isEditing ? 'ring-2 ring-primary' : ''} 
        transition-all duration-300 ease-in-out
        w-full max-w-4xl mx-auto
        sm:min-h-0
      `}
      style={containerStyle}
    >
      {children}
    </div>
  );
}