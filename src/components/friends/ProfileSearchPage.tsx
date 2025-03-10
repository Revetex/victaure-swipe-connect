
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/types/profile";
import { ProfilePreviewCard as ProfileCard } from "@/components/profile/preview/ProfilePreviewCard";
import { ensureValidUserRole } from "@/types/profile";

export function ProfileSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      
      // Search by name or email
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) throw error;

      if (data) {
        // Filter out the current user from results
        const filteredResults = data.filter(profile => profile.id !== user?.id);
        
        // Transform the data to ensure it matches the UserProfile interface
        const transformedResults: UserProfile[] = filteredResults.map(profile => ({
          ...profile,
          role: ensureValidUserRole(profile.role) // Ensure role is valid
        }));
        
        setSearchResults(transformedResults);
      }
    } catch (error) {
      console.error("Error searching profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Rechercher des profils</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou email"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Recherche..." : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((profile) => (
          <div 
            key={profile.id} 
            className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-all"
            onClick={() => setSelectedProfile(profile)}
          >
            <h3 className="font-medium">{profile.full_name}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            {profile.bio && (
              <p className="mt-2 text-sm">{profile.bio}</p>
            )}
          </div>
        ))}
        
        {searchResults.length === 0 && !isLoading && searchQuery && (
          <div className="col-span-full p-4 text-center">
            <p>Aucun résultat trouvé pour "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      {selectedProfile && (
        <ProfileCard 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}
