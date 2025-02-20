
import React from "react";
import { Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";

export function DashboardLayout() {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { profile } = useProfile();

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
    setShowMobileMenu(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <DashboardMobileNav
        currentPage={currentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPageChange={handlePageChange}
      />

      <main className="lg:pl-64">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
