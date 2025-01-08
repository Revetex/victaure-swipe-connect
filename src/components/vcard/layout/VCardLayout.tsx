import { ReactNode } from "react";

interface VCardLayoutProps {
  children: ReactNode;
  isEditing: boolean;
}

export function VCardLayout({ children, isEditing }: VCardLayoutProps) {
  return (
    <div className={`
      relative 
      min-h-[calc(100vh-8rem)] 
      w-full 
      ${isEditing ? 'pb-32' : 'pb-16'} 
      overflow-y-auto 
      scrollbar-thin 
      scrollbar-thumb-gray-300 
      dark:scrollbar-thumb-gray-700
    `}>
      {children}
    </div>
  );
}