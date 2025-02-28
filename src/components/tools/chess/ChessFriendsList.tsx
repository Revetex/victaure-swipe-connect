
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ChessFriendsList() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Jouer avec des amis</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Aucun ami disponible pour jouer aux échecs.
          </p>
          
          <Button
            variant="outline"
            className="w-full"
            size="sm"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Inviter des amis
          </Button>
        </div>
      )}
    </Card>
  );
}
