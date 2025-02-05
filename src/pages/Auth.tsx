import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { AuthBackground } from "@/components/auth/background/AuthBackground";
import { AuthHeader } from "@/components/auth/header/AuthHeader";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5">
      <AuthBackground />
      
      <ThemeSelector />
      
      <main className="flex-1 w-full py-12 px-4 relative z-10">
        <div className="container max-w-xl mx-auto space-y-8">
          <AuthHeader />
          <AuthVideo />

          <motion.div 
            className="glass-card p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <Loader className="w-6 h-6 text-primary" />
              </div>
            }>
              <AuthForm redirectTo={location.state?.from?.pathname} />
            </Suspense>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}