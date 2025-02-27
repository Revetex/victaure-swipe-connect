
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/shell/DashboardShell";
import { DashboardHeader } from "@/components/shell/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { FriendsList } from "./FriendsList";
import { toast } from "sonner";

export function FriendsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { pendingRequests } = useFriendRequests();

  useEffect(() => {
    if (!user) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/auth");
    }
  }, [user, navigate]);

  const pendingCount = pendingRequests.length;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Mes amis"
        text="Gérez vos connexions et vos contacts"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/friends/requests")}
          >
            Demandes
            {pendingCount > 0 && (
              <span className="ml-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={() => navigate("/friends/search")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </DashboardHeader>

      <div className="flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un ami..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <FriendsList searchQuery={searchQuery} />
      </div>
    </DashboardShell>
  );
}
