
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SettingsSections } from "./SettingsSections";
import { SettingsHeader } from "./SettingsHeader";
import { DashboardNavigation } from "../layout/DashboardNavigation";
import { DashboardFriendsList } from "../dashboard/DashboardFriendsList";
import { SettingsLayout } from "./SettingsLayout";
import { ScrollArea } from "../ui/scroll-area";
import { AnimatePresence } from "framer-motion";

export function Settings() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(5);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SettingsLayout>
      <SettingsHeader />

      <AnimatePresence mode="wait">
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <ScrollArea className="h-[calc(100vh-8rem)] overflow-y-auto">
        <SettingsSections />
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <DashboardNavigation 
          currentPage={currentPage} 
          onPageChange={(page) => {
            if (page !== 5) {
              navigate('/dashboard');
            }
          }}
          isEditing={false}
        />
      </div>
    </SettingsLayout>
  );
}
