
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Users, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FriendsList } from './FriendsList';
import { FriendRequestsPage } from './FriendRequestsPage';
import { ProfileSearchPage } from './ProfileSearchPage';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implémenter la recherche
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto max-w-5xl p-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Connexions</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos connexions, trouvez de nouveaux contacts et restez en contact
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="bg-muted/50 flex-shrink-0">
            <TabsTrigger value="friends" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>Mes amis</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              <span>Demandes</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center">
              <UserPlus className="w-4 h-4 mr-2" />
              <span>Découvrir</span>
            </TabsTrigger>
          </TabsList>

          {activeTab === 'friends' && (
            <div className="flex items-center gap-2 ml-auto">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button
                variant={showOnlineOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className="whitespace-nowrap"
              >
                {showOnlineOnly ? "En ligne" : "Tous"}
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="friends" className="mt-0">
            <FriendsList />
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            <FriendRequestsPage />
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            <ProfileSearchPage />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
