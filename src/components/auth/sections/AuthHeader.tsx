
import { Logo } from "@/components/Logo";

export function AuthHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <Logo size="xl" className="transform-none text-[#F2EBE4]" />
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#F2EBE4] font-tiempos text-center px-4">
        La Plateforme Complète du Marché de l'Emploi
      </h1>

      <p className="text-[#64B5D9] font-medium text-lg">
        Une entreprise fièrement québécoise
      </p>
    </div>
  );
}
