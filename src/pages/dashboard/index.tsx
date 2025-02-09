
import { Feed } from "@/components/feed/Feed";
import { useProfile } from "@/hooks/useProfile";
import { VCardCreationForm } from "@/components/VCardCreationForm";
import { MainLayout } from "@/components/layout/MainLayout";

export default function DashboardPage() {
  const { profile } = useProfile();

  const content = !profile?.full_name ? (
    <div className="container py-6">
      <VCardCreationForm />
    </div>
  ) : (
    <Feed />
  );

  return (
    <MainLayout>
      {content}
    </MainLayout>
  );
}

