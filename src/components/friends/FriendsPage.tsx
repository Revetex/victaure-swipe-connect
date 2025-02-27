
import { useState } from "react";
import { DashboardShell } from "@/components/shell/DashboardShell";
import { DashboardHeader } from "@/components/shell/DashboardHeader";
import { FriendsList } from "./FriendsList";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleOnlineToggle = (checked: boolean) => {
    setShowOnlineOnly(checked);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Mes connexions"
        text="Gérez vos connexions et vos demandes d'amis"
      >
        <Button onClick={() => navigate("/friends/search")} size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter des amis
        </Button>
      </DashboardHeader>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="online-only"
              checked={showOnlineOnly}
              onCheckedChange={handleOnlineToggle}
            />
            <Label htmlFor="online-only">En ligne uniquement</Label>
          </div>
        </div>

        <Tabs defaultValue="friends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="friends">Amis</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-4">
            <FriendsList 
              searchQuery={searchQuery} 
              showOnlineOnly={showOnlineOnly}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </TabsContent>
          
          <TabsContent value="suggestions">
            <div className="text-center py-12 text-muted-foreground">
              Fonctionnalité à venir
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
