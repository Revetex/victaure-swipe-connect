
import { Navigation } from "@/components/Navigation";
import { memo } from "react";

const MemoizedNavigation = memo(Navigation);

export function Sidebar() {
  return (
    <aside 
      className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background/95 backdrop-blur z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <MemoizedNavigation />
    </aside>
  );
}
