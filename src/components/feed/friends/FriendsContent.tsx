
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users, Bell, UserPlus } from "lucide-react";
import { ProfileSearch } from "../ProfileSearch";
import { UserProfile } from "@/types/profile";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { FriendItem } from "./FriendItem";
import { ConnectionsSection } from "./ConnectionsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FriendsTabContent } from "./components/FriendsTabContent";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";
import { Badge } from "@/components/ui/badge";

export function FriendsContent() {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const { sendFriendRequest, pendingRequests } = useFriendRequests();
  const pendingCount = pendingRequests.length;
  const { user } = useAuth();
  const { themeStyle, isDark } = useThemeContext();

  const handleProfileSelect = async (profile: UserProfile) => {
    if (!profile.id || !user) return;
    await sendFriendRequest(profile.id);
  };

  // Exemple de requête pour obtenir des profils suggérés
  const { data: suggestedProfiles = [], isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["suggestedProfiles", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        // Cette requête pourrait être adaptée en fonction de vos besoins
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(5);
          
        if (error) throw error;
        
        // Convertir les profils bruts en UserProfile avec la propriété friends requise
        return (profiles || []).map((profile: any) => ({
          ...profile,
          friends: [],  // Ajouter cette propriété manquante
          // Assurer d'autres propriétés requises
          email: profile.email || null,
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url || null,
          role: profile.role || 'professional',
          bio: profile.bio || '',
          phone: profile.phone || '',
          city: profile.city || '',
          state: profile.state || '',
          country: profile.country || '',
          skills: profile.skills || [],
          online_status: profile.online_status || false,
          last_seen: profile.last_seen || null,
          created_at: profile.created_at || new Date().toISOString()
        })) as UserProfile[];
      } catch (error) {
        console.error('Error fetching suggested profiles:', error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  const togglePendingRequests = () => {
    setShowPendingRequests(!showPendingRequests);
  };

  return (
    <div className={`relative pt-4 pb-10 space-y-6 theme-${themeStyle}`}>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {activeTab === "friends" ? "Mes connexions" :
            activeTab === "discover" ? "Découvrir" :
            activeTab === "suggestions" ? "Suggestions" : "Connexions"}
          </h1>
          {pendingCount > 0 && (
            <Badge variant="default" className="bg-primary hover:bg-primary/90">
              {pendingCount} en attente
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          {activeTab === "friends" ? "Gérez vos connexions et discutez avec vos amis" :
          activeTab === "discover" ? "Découvrez de nouveaux contacts" : 
          activeTab === "suggestions" ? "Suggestions basées sur vos intérêts" : 
          "Restez connecté avec votre réseau"}
        </p>
      </motion.header>

      <Tabs
        defaultValue="friends"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList className={cn(
            "bg-muted/50 border border-border/20 backdrop-blur-sm",
            "p-1 rounded-lg h-auto",
            "w-full sm:w-auto"
          )}>
            <TabsTrigger value="friends" className="relative flex gap-2 items-center h-10">
              <Users className="h-4 w-4" />
              <span>Connexions</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="relative flex gap-2 items-center h-10">
              <UserPlus className="h-4 w-4" />
              <span>Découvrir</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="relative flex gap-2 items-center h-10">
              <Bell className="h-4 w-4" />
              <span>Suggestions</span>
              {suggestedProfiles.length > 0 && (
                <Badge variant="outline" className={cn(
                  "absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs rounded-full",
                  "bg-primary/20 text-primary border-primary/30"
                )}>
                  {suggestedProfiles.length > 9 ? '9+' : suggestedProfiles.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "discover" && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                className={cn(
                  "w-full sm:w-[250px] pl-10",
                  "bg-muted/50 border-border/20",
                  "focus:ring-1 focus:ring-primary/30 focus:border-primary/40",
                  "transition-all duration-200"
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <TabsContent
              value="friends"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <ConnectionsSection 
                searchQuery={searchQuery} 
                onTogglePending={togglePendingRequests} 
                showPendingRequests={showPendingRequests} 
              />
            </TabsContent>

            <TabsContent
              value="discover"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <ProfileSearch
                onSelect={handleProfileSelect}
                placeholder="Rechercher des profils..."
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Le contenu sera rempli par les résultats de recherche */}
                <div className={cn(
                  "p-6 rounded-xl text-center",
                  "border border-border/20 bg-background/30 backdrop-blur-sm"
                )}>
                  <UserPlus className="h-12 w-12 mx-auto mb-3 text-primary/60" />
                  <h3 className="text-lg font-medium mb-2">Trouvez de nouveaux contacts</h3>
                  <p className="text-muted-foreground text-sm">
                    Utilisez la barre de recherche ci-dessus pour trouver des personnes à ajouter à votre réseau
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="suggestions"
              className="mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <FriendsTabContent
                currentPage={1}
                itemsPerPage={5}
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
