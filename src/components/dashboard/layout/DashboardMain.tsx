import { useEffect, useState } from "react";
import { ContentRouter } from "@/components/dashboard/content/ContentRouter";
import { DashboardMobileNav } from "./DashboardMobileNav";
import { DashboardSidebar } from "./DashboardSidebar";
import { AppHeader } from "@/components/header/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Post } from "@/types/posts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Home, Briefcase, Users, MessageSquare, Settings as SettingsIcon, Bell, LayoutDashboard, BarChartBig, ListChecks, Calculator, Languages, StickyNote, Dice6 } from "lucide-react";

export function DashboardMain() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleRequestChat = () => {
    setShowAIChat(true);
  };

  const handleEditStateChange = (editing: boolean) => {
    setIsEditing(editing);
  };

  const renderDashboardHome = () => {
    const { user } = useAuth();
    const { profile } = useProfile();
  
    return (
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <div className="bg-white/5 backdrop-blur-sm supports-[backdrop-filter]:bg-white/5 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Bienvenue sur Victaure, {profile?.full_name || user?.email}!
              </h2>
              <p className="text-gray-300">
                Explorez les différentes sections pour optimiser votre carrière et
                développer votre réseau professionnel.
              </p>
            </div>
          </div>
  
          <div className="w-full md:w-1/2">
            <div className="bg-white/5 backdrop-blur-sm supports-[backdrop-filter]:bg-white/5 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3 text-white">
                Accès rapide
              </h3>
              <div className="flex flex-col gap-2">
                <Link to="/jobs">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Briefcase className="w-4 h-4" />
                    Consulter les offres d'emploi
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Développer mon réseau
                </Button>
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Envoyer un message
                </Button>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-white/5 backdrop-blur-sm supports-[backdrop-filter]:bg-white/5 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3 text-white">
            Statistiques récentes
          </h3>
          <p className="text-gray-300">
            Ici, vous pourrez suivre l'évolution de votre profil et de votre
            activité sur la plateforme.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <AppHeader onRequestAssistant={handleRequestChat} />
      
      {/* Add padding-top to account for fixed header */}
      <div className="pt-[88px] flex-1">
        <div className="flex">
          <DashboardSidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <div className="flex-1">
            <ContentRouter
              currentPage={currentPage}
              onEditStateChange={handleEditStateChange}
              onRequestChat={handleRequestChat}
              renderDashboardHome={renderDashboardHome}
            />
          </div>
        </div>
      </div>
      
      <DashboardMobileNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
    </div>
  );
}
