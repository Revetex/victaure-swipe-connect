import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export function ToolsNavigation() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-lg"
      style={{ 
        height: '4rem',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        <DashboardNavigation currentPage={5} onPageChange={() => {}} />
      </div>
    </nav>
  );
}