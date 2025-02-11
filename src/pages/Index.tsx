
import { HeroSection } from "@/components/landing/HeroSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadApk } from "@/components/dashboard/UploadApk";
import { DownloadApp } from "@/components/dashboard/DownloadApp";

const LoadingFallback = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full" />
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-purple-900/5 to-background">
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-4 md:pt-8"
        >
          <Suspense fallback={<LoadingFallback />}>
            <HeroSection />
            <div className="container mx-auto p-4 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UploadApk />
                <DownloadApp />
              </div>
            </div>
            <Features />
          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
