
import { ReactNode } from "react";

interface ChatHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <div className="flex flex-col gap-1 p-4 border-b border-[#F1F0FB]/10 bg-[#1B2A4A]/50">
      <div className="text-lg font-semibold text-[#F1F0FB]">{title}</div>
      {subtitle && (
        <div className="text-sm text-[#F1F0FB]/70">{subtitle}</div>
      )}
    </div>
  );
}
