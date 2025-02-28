
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shell/DashboardShell";
import { DashboardHeader } from "@/components/shell/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/profile";
import { ProfileCard } from "@/components/profile/preview/ProfilePreviewCard";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSearchPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<UserProfile[]>([]);
  const { pendingRequests, sendFriendRequest } = useFriendRequests();

  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;
    
    setIsSearching(true);
    
    try {
      // Get user profiles matching the search term
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .ilike('full_name', `%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      // Get existing connections for this user
      const { data: connections, error: connError } = await supabase
        .from('user_connections')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      
      if (connError) throw connError;
      
      // Filter out users who are already connected
      const filteredResults = data.filter(profile => {
        return !connections.some(conn => 
          (conn.sender_id === user.id && conn.receiver_id === profile.id) ||
          (conn.receiver_id === user.id && conn.sender_id === profile.id)
        );
      });
      
      setResults(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleConnect = async (profileId: string) => {
    await sendFriendRequest(profileId);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Rechercher des personnes"
        text="Trouvez des professionnels et développez votre réseau"
      />
      
      <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
        <Input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
      
      {isSearching ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((profile) => (
            <div key={profile.id} className="rounded-lg border p-4 flex flex-col">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-zinc-200 overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-zinc-300">
                      {profile.full_name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{profile.full_name}</h3>
                  <p className="text-sm text-zinc-500">{profile.role}</p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Button 
                  className="w-full" 
                  onClick={() => handleConnect(profile.id)}
                  disabled={pendingRequests.some(
                    req => req.receiver_id === profile.id || req.sender_id === profile.id
                  )}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {pendingRequests.some(
                    req => req.receiver_id === profile.id || req.sender_id === profile.id
                  )
                    ? "Demande en cours"
                    : "Connecter"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : searchTerm && !isSearching ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun résultat trouvé pour "{searchTerm}".
        </div>
      ) : null}
    </DashboardShell>
  );
}
