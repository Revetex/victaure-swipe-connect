
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/shell/DashboardShell";
import { DashboardHeader } from "@/components/shell/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Check, X, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FriendRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("received");
  const { incomingRequests, outgoingRequests, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, isLoading } = useFriendRequests();

  useEffect(() => {
    if (!user) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Demandes d'ami"
        text="Gérez les demandes d'ami reçues et envoyées"
      >
        <Button 
          variant="default"
          size="sm"
          onClick={() => navigate("/friends/search")}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Rechercher des personnes
        </Button>
      </DashboardHeader>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">
            Reçues ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Envoyées ({outgoingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande d'ami reçue.
            </div>
          ) : (
            <div className="grid gap-4">
              {incomingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={request.sender.avatar_url || "/placeholder-avatar.png"}
                      alt={request.sender.full_name || ""}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{request.sender.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        A envoyé une demande d'ami
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => rejectFriendRequest(request.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Refuser
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => acceptFriendRequest(request.id)}
                      disabled={isLoading}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accepter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande d'ami envoyée.
            </div>
          ) : (
            <div className="grid gap-4">
              {outgoingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={request.receiver.avatar_url || "/placeholder-avatar.png"}
                      alt={request.receiver.full_name || ""}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{request.receiver.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        En attente d'acceptation
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => cancelFriendRequest(request.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
