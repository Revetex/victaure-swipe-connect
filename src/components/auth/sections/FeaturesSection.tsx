
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@/components/ui/loader";
import { FeatureBox } from "./features/FeatureBox";
import { Html, OrbitControls } from "@react-three/drei";

export function FeaturesSection() {
  return (
    <div className="h-[300px] w-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 75 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#1A1F2C"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />
        <Suspense fallback={
          <Html center>
            <Loader className="w-8 h-8 text-[#64B5D9]" />
          </Html>
        }>
          <FeatureBox position={[0, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
