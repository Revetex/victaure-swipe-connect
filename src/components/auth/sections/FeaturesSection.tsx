
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@/components/ui/loader";
import { FeatureBox } from "./features/FeatureBox";

export function FeaturesSection() {
  return (
    <div className="h-[300px] w-full">
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center">
          <Loader className="w-8 h-8 text-[#64B5D9]" />
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 7], fov: 75 }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#1A1F2C"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <FeatureBox position={[0, 0, 0]} />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}
