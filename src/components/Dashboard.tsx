import { useProfile } from "@/hooks/useProfile";
import { DashboardAuth } from "./dashboard/core/DashboardAuth";
import { DashboardLayout } from "./dashboard/core/DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";

export function Dashboard() {
  const { profile, isLoading: isProfileLoading } = useProfile();

  if (isProfileLoading) {
    return <DashboardAuth />;
  }

  if (!profile) {
    return <VCardCreationForm />;
  }

  return <DashboardLayout />;
}