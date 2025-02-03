import { ReactNode } from "react";
import { MarketingPanel } from "./MarketingPanel";

interface DashboardContainerProps {
  children: ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <div className="flex-1">
        {children}
      </div>
      <div className="hidden xl:block">
        <MarketingPanel />
      </div>
    </div>
  );
}