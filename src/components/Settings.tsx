
import { Palette, Bell, Shield, Lock, Ban, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { SecuritySection } from "./settings/SecuritySection";
import { PrivacySection } from "./settings/PrivacySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { PaymentSection } from "./settings/PaymentSection";
import { LogoutSection } from "./settings/LogoutSection";

const settingsSections = [
  { id: 'appearance', title: 'Apparence', icon: Palette, Component: AppearanceSection },
  { id: 'notifications', title: 'Notifications', icon: Bell, Component: NotificationsSection },
  { id: 'security', title: 'Sécurité', icon: Lock, Component: SecuritySection },
  { id: 'privacy', title: 'Confidentialité', icon: Shield, Component: PrivacySection },
  { id: 'blocked', title: 'Bloqués', icon: Ban, Component: BlockedUsersSection },
  { id: 'payments', title: 'Paiements', icon: CreditCard, Component: PaymentSection },
  { id: 'logout', title: 'Déconnexion', icon: LogOut, Component: LogoutSection }
];

export function Settings() {
  return (
    <div className="max-w-3xl mx-auto p-4 pt-20">
      <div className="space-y-6">
        {settingsSections.map(({ id, title, icon: Icon, Component }) => (
          <div 
            key={id}
            className="bg-card rounded-lg border p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-medium">{title}</h2>
            </div>
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
