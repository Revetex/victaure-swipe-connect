
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, 
  Briefcase, 
  Users, 
  Store, 
  Layout, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Trophy, 
  Calendar,
  MessageCircle,
  BookOpen,
  Lightbulb,
  BarChart3,
  Target,
  FileText,
  Activity,
  HelpCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SidebarLink {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: { content: string; variant: "default" | "outline" };
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  // Fermer le sidebar mobile lors d'un changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);

      // Simulons des liens rapides personnalisés depuis la base de données
      setQuickLinks([
        { id: 1, title: "Tableau de bord", icon: BarChart3, path: "/dashboard" },
        { id: 2, title: "CVs & Portfolio", icon: FileText, path: "/profile" },
        { id: 3, title: "Candidatures", icon: Target, path: "/applications" },
        { id: 4, title: "Ressources", icon: BookOpen, path: "/resources" },
      ]);

    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const mainMenuItems: SidebarLink[] = [
    { 
      title: "Accueil", 
      path: "/", 
      icon: Home 
    },
    { 
      title: "Emplois", 
      path: "/jobs", 
      icon: Briefcase, 
      badge: { content: "12", variant: "outline" }
    },
    { 
      title: "Réseau", 
      path: "/connections", 
      icon: Users,
      badge: { content: "3", variant: "default" }
    },
    { 
      title: "Messages", 
      path: "/messages", 
      icon: MessageCircle,
      badge: { content: "5", variant: "default" }
    },
    { 
      title: "Marketplace", 
      path: "/marketplace", 
      icon: Store 
    },
    { 
      title: "Carrière", 
      path: "/career", 
      icon: Trophy 
    },
    { 
      title: "Événements", 
      path: "/events", 
      icon: Calendar 
    }
  ];

  const toolsItems: SidebarLink[] = [
    { title: "Applications", path: "/apps", icon: Layout },
    { title: "Ressources", path: "/resources", icon: BookOpen },
    { title: "Formations", path: "/learning", icon: Lightbulb },
    { title: "Suivi Santé", path: "/health", icon: Activity },
  ];

  const renderSidebarLink = (item: SidebarLink) => (
    <Link to={item.path} key={item.path} className="block w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-white/70 hover:text-white",
          location.pathname === item.path && "bg-[#64B5D9]/10 text-white",
          collapsed ? "px-3" : "px-3"
        )}
      >
        <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
        {!collapsed && <span className="ml-3">{item.title}</span>}
        {!collapsed && item.badge && (
          <Badge
            variant={item.badge.variant}
            className={cn(
              "ml-auto",
              item.badge.variant === "outline" 
                ? "border-[#64B5D9]/30 text-[#64B5D9]" 
                : "bg-[#64B5D9] text-[#1B2A4A]"
            )}
          >
            {item.badge.content}
          </Badge>
        )}
      </Button>
    </Link>
  );

  const renderSidebarGroup = (title: string, items: SidebarLink[]) => (
    <div className="py-2">
      {!collapsed && (
        <div className="px-3 py-1.5 text-xs font-medium text-white/50 uppercase">
          {title}
        </div>
      )}
      <div className="space-y-1 px-2">
        {items.map(renderSidebarLink)}
      </div>
    </div>
  );

  const renderSidebarTrigger = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMobileOpen(!mobileOpen)}
      className="lg:hidden text-white hover:bg-white/10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    </Button>
  );

  return (
    <>
      {/* Overlay pour la version mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "h-screen fixed inset-y-0 left-0 z-30 flex flex-col",
          "transition-all duration-300 overflow-hidden",
          "bg-[#1A1F2C]/95 backdrop-blur-md border-r border-[#64B5D9]/10",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Entête du sidebar */}
        <div className="flex-shrink-0 border-b border-[#64B5D9]/10 h-16">
          {!collapsed && (
            <div className="flex items-center p-4 h-full">
              <img 
                src="/lovable-uploads/white-signature.png" 
                alt="Victaure" 
                className="h-8"
              />
            </div>
          )}
        </div>
        
        {/* Contenu principal du sidebar */}
        <div className="flex-1 overflow-y-auto p-2 space-y-6">
          {profile && (
            <Link to="/profile" className="block">
              <div className={cn(
                "flex items-center p-2 rounded-lg hover:bg-white/5 transition-colors",
                collapsed ? "justify-center" : "gap-3"
              )}>
                <Avatar className="h-10 w-10 border border-[#64B5D9]/20">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="bg-[#1B2A4A] text-[#64B5D9]">
                    {profile.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {profile.full_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {profile.role || "Professionnel"}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          )}

          {renderSidebarGroup("Navigation", mainMenuItems)}
          {renderSidebarGroup("Outils", toolsItems)}

          {/* Section des liens rapides */}
          {quickLinks.length > 0 && !collapsed && (
            <div className="py-2">
              <div className="px-3 py-1.5 text-xs font-medium text-white/50 uppercase">
                Liens rapides
              </div>
              <div className="grid grid-cols-2 gap-2 px-2 py-1">
                {quickLinks.map((link) => (
                  <Link 
                    key={link.id} 
                    to={link.path}
                    className="group flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <link.icon className="h-5 w-5 text-[#64B5D9] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-center text-white/80 group-hover:text-white">
                      {link.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pied du sidebar */}
        <div className="flex-shrink-0 p-2 border-t border-[#64B5D9]/10">
          <div className="space-y-1">
            <Link to="/settings" className="block w-full">
              <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white">
                <Settings className={cn("h-5 w-5", collapsed && "mx-auto")} />
                {!collapsed && <span className="ml-3">Paramètres</span>}
              </Button>
            </Link>
            <Link to="/help" className="block w-full">
              <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white">
                <HelpCircle className={cn("h-5 w-5", collapsed && "mx-auto")} />
                {!collapsed && <span className="ml-3">Aide</span>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className={cn("h-5 w-5", collapsed && "mx-auto")} />
              {!collapsed && <span className="ml-3">Déconnexion</span>}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full h-8 mt-2 text-white/50 hover:text-white hover:bg-white/5"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              collapsed ? "rotate-0" : "rotate-180"
            )} />
          </Button>
        </div>
      </div>
    </>
  );
}
