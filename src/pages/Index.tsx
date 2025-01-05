import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      setIsPageLoading(false);
    }, 5000); // 5 seconds maximum loading time

    if (!isLoading) {
      setIsPageLoading(false);
      if (!isAuthenticated) {
        toast.error("Veuillez vous connecter pour accéder à cette page");
        navigate("/auth");
      }
    }

    // Cleanup timeout
    return () => clearTimeout(loadingTimeout);
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state with better UI feedback
  if (isPageLoading || isLoading) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <Loader className="h-12 w-12" />
        <p className="text-muted-foreground animate-pulse">
          Chargement de votre espace...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <DashboardLayout />
    </div>
  );
}