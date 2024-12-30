import { Navigation } from "@/components/Navigation";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Index() {
  return (
    <div className="min-h-screen bg-victaure-dark">
      <Navigation />
      <main className="pt-16">
        <DashboardLayout />
      </main>
    </div>
  );
}