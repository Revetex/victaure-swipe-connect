import { DashboardLayout } from "@/components/DashboardLayout";
import { Footer } from "@/components/Footer";

export default function Index() {
  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      <div className="flex-1">
        <DashboardLayout />
      </div>
      <Footer />
    </div>
  );
}