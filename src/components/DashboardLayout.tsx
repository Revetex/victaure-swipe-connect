import React, { useState, useEffect } from "react";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardMain } from "./dashboard/layout/DashboardMain";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { useViewport } from "@/hooks/useViewport";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";

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
    <DashboardContainer>
      <DashboardHeader
        title={getPageTitle()}
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
        isEditing={isEditing}
      />
      
      <AnimatePresence>
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <DashboardMain>
        <DashboardContent
          currentPage={currentPage}
          viewportHeight={viewportHeight}
          isEditing={isEditing}
          onEditStateChange={setIsEditing}
          onRequestChat={() => setCurrentPage(2)}
        />
      </DashboardMain>

      <DashboardNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isEditing={isEditing}
      />
    </DashboardContainer>
  );
};