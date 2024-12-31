import { DashboardContainer } from "./dashboard/sections/DashboardContainer";
import { DashboardContent } from "./dashboard/sections/DashboardContent";

export function DashboardLayout() {
  return (
    <DashboardContainer>
      <DashboardContent />
    </DashboardContainer>
  );
}