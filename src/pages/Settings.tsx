import { Settings } from "@/components/Settings";

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <Settings />
    </div>
  );
}