
import React, { Suspense } from "react";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { motion } from "framer-motion";
import { DashboardLoading } from "./dashboard/layout/DashboardLoading";
import { Feed } from "@/components/Feed";
import { MainLayout } from "./layout/MainLayout";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export function DashboardLayout() {
  return (
    <DashboardAuthCheck>
      <motion.main 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        <MainLayout>
          <Suspense fallback={<DashboardLoading />}>
            <Feed />
          </Suspense>
        </MainLayout>
      </motion.main>
    </DashboardAuthCheck>
  );
}
