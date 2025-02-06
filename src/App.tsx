
import { Suspense, lazy } from "react";
import { AppRoutes } from "./AppRoutes";
import { Loader } from "@/components/ui/loader";

// Lazy load components that might not be needed immediately
const AuthCallback = lazy(() => import("@/components/AuthCallback").then(module => ({ default: module.AuthCallback })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader className="w-8 h-8 text-primary" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppRoutes />
      <AuthCallback />
    </Suspense>
  );
}
