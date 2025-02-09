
import { Feed } from "@/components/feed/Feed";
import { useProfile } from "@/hooks/useProfile";
import { VCardCreationForm } from "@/components/VCardCreationForm";

export default function DashboardPage() {
  const { profile } = useProfile();

  if (!profile?.full_name) {
    return (
      <div className="container py-6">
        <VCardCreationForm />
      </div>
    );
  }

  return <Feed />;
}
