
import { Feed } from "@/components/feed/Feed";
import { useProfile } from "@/hooks/useProfile";
import { VCardCreationForm } from "@/components/VCardCreationForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";

export default function DashboardPage() {
  const { profile } = useProfile();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MainLayout>
      {!profile?.full_name ? (
        <div className="container py-6">
          <VCardCreationForm />
        </div>
      ) : (
        <Feed />
      )}
    </MainLayout>
  );
}
