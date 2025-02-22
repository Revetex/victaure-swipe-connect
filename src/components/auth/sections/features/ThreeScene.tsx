
import { Canvas } from "@react-three/fiber";
import { Scene3D } from "./Scene3D";

export default function ThreeScene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 7] }}
      gl={{ antialias: true }}
    >
      <Scene3D />
    </Canvas>
  );
}
