import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { cn } from "@/lib/utils";
export function DashboardLayout({
  children
}: {
  children?: React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const {
    profile
  } = useProfile();
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
    setShowMobileMenu(false);
  }, []);
  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);
  return <div className="flex min-h-screen bg-background relative">
      <DashboardSidebar currentPage={currentPage} onPageChange={handlePageChange} />

      <DashboardMobileNav currentPage={currentPage} showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} onPageChange={handlePageChange} />

      
    </div>;
}