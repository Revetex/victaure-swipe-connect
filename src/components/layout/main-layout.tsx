import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "../ui/loading-screen";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background">
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </div>
  );
}