
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { cn } from "@/lib/utils";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { FeaturesSection } from "@/components/auth/sections/FeaturesSection";
import { InnovationsSection } from "@/components/auth/sections/InnovationsSection";
import { CountdownSection } from "@/components/auth/sections/CountdownSection";

export default function Auth() {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between min-h-screen w-full",
        "bg-gradient-to-b from-[#131B25] via-[#1B2A4A] to-[#1A1F2C]",
        "text-white"
      )}
      style={{ minHeight: viewportHeight ? `${viewportHeight}px` : "100vh" }}
    >
      <div className="w-full">
        <AuthHeader />
        <main className="container px-4 pt-6 pb-12 md:pt-12 md:pb-24 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <AuthForm />
            <AuthVideo />
          </div>
          <FeaturesSection />
          <InnovationsSection />
          <CountdownSection />
        </main>
      </div>
      <AuthFooter />
    </div>
  );
}
