import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function VCardEmpty() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créez votre profil</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <UserPlus className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">
          Vous n'avez pas encore de profil. Créez-en un pour commencer à utiliser l'application.
        </p>
        <Button>Créer mon profil</Button>
      </CardContent>
    </Card>
  );
}