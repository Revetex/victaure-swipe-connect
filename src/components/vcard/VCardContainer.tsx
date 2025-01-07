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
      className={`relative p-6 rounded-xl shadow-lg bg-background dark:bg-background ${isEditing ? 'ring-2 ring-primary' : ''}`}
      style={containerStyle}
    >
      {children}
    </div>
  );
}