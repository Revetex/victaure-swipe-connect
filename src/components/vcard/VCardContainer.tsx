interface CustomStyles {
  font?: string | null;
  background?: string | null;
  textColor?: string | null;
}

interface VCardContainerProps {
  children: React.ReactNode;
  isEditing: boolean;
  customStyles?: CustomStyles;
  selectedStyle: any;
}

export function VCardContainer({ 
  children, 
  isEditing, 
  customStyles,
  selectedStyle 
}: VCardContainerProps) {
  const containerStyle: React.CSSProperties = {
    fontFamily: customStyles?.font || selectedStyle.font || undefined,
    backgroundColor: customStyles?.background || selectedStyle.color || undefined,
    color: customStyles?.textColor || selectedStyle.colors.text.primary || undefined,
  };

  return (
    <div 
      className={`
        relative p-4 sm:p-6 rounded-xl shadow-lg
        ${isEditing ? 'ring-2 ring-primary' : ''} 
        transition-all duration-300 ease-in-out
        w-full max-w-7xl mx-auto
        min-h-[calc(100vh-4rem)] sm:min-h-0
        backdrop-blur-lg
        border border-white/10
        hover:border-white/20
        dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90
      `}
      style={{
        ...containerStyle,
        background: `linear-gradient(135deg, ${selectedStyle.color}, ${selectedStyle.secondaryColor})`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 rounded-xl pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}