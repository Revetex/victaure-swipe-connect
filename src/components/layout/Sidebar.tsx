
import { Navigation } from "@/components/Navigation";
import { memo } from "react";

interface SidebarProps {
  onNavigate: (path: string) => void;
}

const MemoizedNavigation = memo(Navigation);

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside 
      className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background z-[100]"
      role="navigation"
      aria-label="Main navigation"
    >
      <MemoizedNavigation onNavigate={onNavigate} />
    </aside>
  );
}
