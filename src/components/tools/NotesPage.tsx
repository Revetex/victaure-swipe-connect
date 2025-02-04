import { NotesMap } from "@/components/notes/NotesMap";
import { DashboardLayout } from "@/components/DashboardLayout";

export function NotesPage() {
  return (
    <DashboardLayout>
      <div className="h-[calc(100dvh-8rem)] w-full">
        <NotesMap />
      </div>
    </DashboardLayout>
  );
}