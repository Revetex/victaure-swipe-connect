
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ConnectionsSection } from "./ConnectionsSection";
import { motion } from "framer-motion";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { ProfilePreview } from "@/components/ProfilePreview";
import { Card } from "@/components/ui/card";
import { Search, UserPlus2, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useConnections from "@/components/connections/hooks/useConnections";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const searchCardVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const connectionsVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [searchMode, setSearchMode] = useState<'people' | 'skills' | 'location'>('people');
  const { connections, isLoading, handleSendFriendRequest } = useConnections();
  
  const handleProfileSelect = async (profile: UserProfile) => {
    setSelectedProfile(profile);
  };

  const handleClosePreview = () => {
    setSelectedProfile(null);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] space-y-6 bg-gradient-to-br from-[#1B2A4A] to-[#1A1F2C]"
    >
      <motion.div variants={searchCardVariants} transition={{ duration: 0.3 }}>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <UserPlus2 className="w-6 h-6 text-[#64B5D9]" />
            <h2 className="text-xl font-semibold text-white">
              Trouver des connexions
            </h2>
          </motion.div>
          
          <Tabs defaultValue="people" className="w-full mb-6" onValueChange={(value) => setSearchMode(value as any)}>
            <TabsList className="grid grid-cols-3 mb-4 bg-white/5">
              <TabsTrigger value="people" className="data-[state=active]:bg-[#64B5D9]/20">
                <Users className="w-4 h-4 mr-2" />
                Personnes
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-[#64B5D9]/20">
                <Filter className="w-4 h-4 mr-2" />
                Compétences
              </TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-[#64B5D9]/20">
                <Search className="w-4 h-4 mr-2" />
                Lieu
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="people" className="space-y-4">
              <div className="relative">
                <ProfileSearch 
                  onSelect={handleProfileSelect}
                  placeholder="Rechercher par nom..."
                  className="w-full bg-white/5 backdrop-blur-md 
                         transition-all duration-300
                         focus-within:bg-white/10
                         border-white/10 focus-within:border-[#64B5D9]/30
                         text-white placeholder-white/50"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
              
              {connections.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connections.slice(0, 3).map((connection) => (
                    <ConnectionSuggestionCard 
                      key={connection.id}
                      profile={connection}
                      onConnect={() => handleSendFriendRequest(connection.id)}
                      onViewProfile={() => handleProfileSelect(connection)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-4">
              <div className="relative">
                <ProfileSearch 
                  onSelect={handleProfileSelect}
                  placeholder="Rechercher par compétences..."
                  className="w-full bg-white/5 backdrop-blur-md 
                         transition-all duration-300
                         focus-within:bg-white/10
                         border-white/10 focus-within:border-[#64B5D9]/30
                         text-white placeholder-white/50"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {['React', 'Next.js', 'TypeScript', 'JavaScript', 'UI/UX', 'Python', 'Marketing', 'Data Science'].map((skill) => (
                  <Button 
                    key={skill}
                    variant="outline" 
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4">
              <div className="relative">
                <ProfileSearch 
                  onSelect={handleProfileSelect}
                  placeholder="Rechercher par ville, région, pays..."
                  className="w-full bg-white/5 backdrop-blur-md 
                         transition-all duration-300
                         focus-within:bg-white/10
                         border-white/10 focus-within:border-[#64B5D9]/30
                         text-white placeholder-white/50"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {['Montréal', 'Québec', 'Laval', 'Toronto', 'Ottawa', 'Vancouver'].map((location) => (
                  <Button 
                    key={location}
                    variant="outline" 
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      <motion.div 
        variants={connectionsVariants} 
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-4"
      >
        <ConnectionsSection />
      </motion.div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={true}
          onClose={handleClosePreview}
        />
      )}
    </motion.div>
  );
}

interface ConnectionSuggestionCardProps {
  profile: UserProfile;
  onConnect: () => void;
  onViewProfile: () => void;
}

function ConnectionSuggestionCard({ profile, onConnect, onViewProfile }: ConnectionSuggestionCardProps) {
  return (
    <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div 
            className="h-12 w-12 rounded-full bg-cover bg-center bg-slate-800"
            style={{ backgroundImage: profile.avatar_url ? `url(${profile.avatar_url})` : undefined }}
          >
            {!profile.avatar_url && (
              <div className="h-full w-full flex items-center justify-center text-white text-lg font-medium">
                {profile.full_name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white truncate">{profile.full_name}</h3>
              {profile.online_status && (
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              )}
            </div>
            <p className="text-xs text-white/60 truncate">
              {profile.role === 'professional' ? 'Professionnel' : 
               profile.role === 'business' ? 'Entreprise' : 'Administrateur'}
            </p>
          </div>
        </div>
        
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-white/10 text-white text-xs">
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 3 && (
              <Badge variant="outline" className="bg-white/10 text-white text-xs">
                +{profile.skills.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs"
            onClick={onViewProfile}
          >
            Voir profil
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-[#64B5D9] hover:bg-[#64B5D9]/80 text-white text-xs"
            onClick={onConnect}
          >
            <UserPlus2 className="h-3 w-3 mr-1" />
            Connecter
          </Button>
        </div>
      </div>
    </Card>
  );
}
