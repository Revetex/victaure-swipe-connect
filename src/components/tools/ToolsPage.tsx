import { useState } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ToolSelector } from "./sections/ToolSelector";
import { MenuSection } from "./sections/MenuSection";
import { NetworkSection } from "./sections/NetworkSection";

export function ToolsPage() {
  const [currentSection, setCurrentSection] = useState<string>("menu");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pb-16">
        {currentSection === "menu" && <MenuSection />}
        {currentSection === "network" && <NetworkSection />}
        {currentSection === "tools" && <ToolSelector />}
      </main>

      <BottomNavigation 
        currentPage={5} 
        onPageChange={() => {}}
        isEditing={false}
      />
    </div>
  );
}