
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function VCardEmpty() {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#2C2C2C]/50 border-[#3C3C3C]/20">
      <CardContent className="p-6 text-center text-[#808080]">
        Aucune donnée de profil disponible
      </CardContent>
    </Card>
  );
}
