import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function VCardEmpty() {
  return (
    <Card className="w-full max-w-2xl mx-auto glass-card">
      <CardContent className="p-6 text-center text-muted-foreground">
        Aucune donnée de profil disponible
      </CardContent>
    </Card>
  );
}