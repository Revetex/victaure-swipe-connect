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
        relative p-4 sm:p-6 rounded-xl shadow-lg
        ${isEditing ? 'ring-2 ring-primary' : ''} 
        transition-all duration-300 ease-in-out
        w-full max-w-7xl mx-auto
        min-h-[calc(100vh-4rem)] sm:min-h-0
        bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95
        backdrop-blur-lg
        border border-white/10
        hover:border-white/20
        dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90
      `}
      style={containerStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-xl pointer-events-none" />
      {children}
    </div>
  );
}