
import { Canvas } from "@react-three/fiber";
import { Scene3D } from "./features/Scene3D";

export function FeaturesSection() {
  return (
    <div className="h-[300px] w-full">
      <Canvas 
        camera={{ position: [0, 0, 7] }}
        gl={{ antialias: true }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
}
