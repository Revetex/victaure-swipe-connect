import { useProfile } from "@/hooks/useProfile";
import { createEmptyProfile } from "@/types/profile";
import { UserNav } from "./UserNav";

export function Navigation() {
  const { profile } = useProfile();
  
  // Utilisation de createEmptyProfile pour garantir tous les champs requis
  const completeProfile = profile ? {
    ...createEmptyProfile(profile.id, profile.email || ''),
    ...profile
  } : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          {/* Logo ou titre */}
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Espace pour la recherche ou autres éléments */}
          </div>
          <UserNav profile={completeProfile} />
        </div>
      </div>
    </header>
  );
}
