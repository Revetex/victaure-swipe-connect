
import { Navigation } from "@/components/Navigation";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const MemoizedNavigation = memo(Navigation);

export function Sidebar() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <aside 
      className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background z-[100]"
      role="navigation"
      aria-label="Main navigation"
    >
      <MemoizedNavigation onNavigate={handleNavigate} />
    </aside>
  );
}
