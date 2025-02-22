
import { FeatureBox } from "./FeatureBox";

export function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <FeatureBox position={[0, 0, 0]} />
    </>
  );
}
