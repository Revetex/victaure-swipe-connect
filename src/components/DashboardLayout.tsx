import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useViewport } from "@/hooks/useViewport";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

export const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { viewportHeight } = useViewport();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Veuillez vous connecter pour accéder au tableau de bord");
          navigate("/auth");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur lors de la vérification de l'authentification");
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const getPageTitle = () => {
    switch (currentPage) {
      case 1:
        return "Tableau de bord";
      case 2:
        return "Messages";
      case 3:
        return "Marketplace";
      case 4:
        return "Fil d'actualité";
      case 5:
        return "Notes";
      case 6:
        return "Paramètres";
      default:
        return "Tableau de bord";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <ReloadIcon className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      title={getPageTitle()}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      isEditing={isEditing}
      showFriendsList={showFriendsList}
      onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
    >
      <DashboardContent
        currentPage={currentPage}
        viewportHeight={viewportHeight}
        isEditing={isEditing}
        onEditStateChange={setIsEditing}
        onRequestChat={() => setCurrentPage(2)}
      />
    </MainLayout>
  );
};