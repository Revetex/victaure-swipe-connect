
import { Suspense, lazy } from "react";
import { Loader } from "@/components/ui/loader";

const ThreeScene = lazy(() => import("./features/ThreeScene"));

export function FeaturesSection() {
  return (
    <div className="h-[300px] w-full">
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Loader className="w-8 h-8 text-[#64B5D9]" />
        </div>
      }>
        <ThreeScene />
      </Suspense>
    </div>
  );
}
