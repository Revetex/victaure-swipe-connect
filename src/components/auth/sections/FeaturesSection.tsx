
import { Canvas } from "@react-three/fiber";
import { Scene3D } from "./features/Scene3D";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export function FeaturesSection() {
  return (
    <div className="h-[300px] w-full">
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Loader className="w-8 h-8 text-[#64B5D9]" />
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 7] }}
          gl={{ antialias: true }}
        >
          <Scene3D />
        </Canvas>
      </Suspense>
    </div>
  );
}
