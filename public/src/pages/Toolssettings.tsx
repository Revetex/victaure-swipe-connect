import { Settings as SettingsIcon } from "lucide-react";
import { RatesTable } from "@/components/settings/RatesTable";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-950 dark:via-amber-950 dark:to-background">
      <div className="w-full px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-500">
              Paramètres
            </h1>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Taux et montants</h2>
            <RatesTable />
          </div>
        </div>
      </div>
    </div>
  );
}