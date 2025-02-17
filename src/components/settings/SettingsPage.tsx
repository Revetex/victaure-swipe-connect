
import { ProfileForm } from "@/components/settings/ProfileForm";
import { AccountForm } from "@/components/settings/AccountForm";
import { PageLayout } from "@/components/layout/PageLayout";

export function SettingsPage() {
  return (
    <PageLayout>
      <div className="grid gap-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-semibold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            Gérer les paramètres de votre compte et définir vos préférences.
          </p>
        </div>
        <AccountForm />
        <ProfileForm />
      </div>
    </PageLayout>
  );
}
