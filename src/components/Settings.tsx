
import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Bell, Shield, Lock, Ban, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const settingsSections = [
  { id: 'appearance', title: 'Apparence', icon: Palette },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'privacy', title: 'Confidentialité', icon: Shield },
  { id: 'security', title: 'Sécurité', icon: Lock },
  { id: 'blocked', title: 'Bloqués', icon: Ban },
  { id: 'payments', title: 'Paiements', icon: CreditCard },
  { id: 'logout', title: 'Déconnexion', icon: LogOut }
];

export function Settings() {
  return (
    <div className="container max-w-4xl mx-auto p-4 pt-8">
      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {settingsSections.map(({ id, title, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {title}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="bg-card rounded-lg border p-4">
          <TabsContent value="appearance">
            <h2 className="text-lg font-medium mb-4">Apparence</h2>
            <div className="space-y-4">
              {/* Contenu de la section apparence */}
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <h2 className="text-lg font-medium mb-4">Notifications</h2>
            <div className="space-y-4">
              {/* Contenu de la section notifications */}
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <h2 className="text-lg font-medium mb-4">Confidentialité</h2>
            <div className="space-y-4">
              {/* Contenu de la section confidentialité */}
            </div>
          </TabsContent>

          <TabsContent value="security">
            <h2 className="text-lg font-medium mb-4">Sécurité</h2>
            <div className="space-y-4">
              {/* Contenu de la section sécurité */}
            </div>
          </TabsContent>

          <TabsContent value="blocked">
            <h2 className="text-lg font-medium mb-4">Utilisateurs bloqués</h2>
            <div className="space-y-4">
              {/* Contenu de la section utilisateurs bloqués */}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <h2 className="text-lg font-medium mb-4">Paiements</h2>
            <div className="space-y-4">
              {/* Contenu de la section paiements */}
            </div>
          </TabsContent>

          <TabsContent value="logout">
            <h2 className="text-lg font-medium mb-4">Déconnexion</h2>
            <div className="space-y-4">
              {/* Contenu de la section déconnexion */}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
