import { useNavigate } from "react-router-dom";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export function ToolsNavigation() {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[98] bg-background/95 backdrop-blur border-t">
      <div className="container mx-auto py-2">
        <DashboardNavigation 
          currentPage={5}
          onPageChange={(page) => {
            if (page !== 5) {
              navigate('/dashboard');
            }
          }}
          isEditing={false}
        />
      </div>
    </nav>
  );
}