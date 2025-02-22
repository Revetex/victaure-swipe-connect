
import { useRef, useState } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from 'three';
import { features } from "./featureData";

interface FeatureBoxProps {
  position: [number, number, number];
}

export function FeatureBox({ position }: FeatureBoxProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      position={position}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color={hovered ? "#64B5D9" : "#1B2A4A"} />
      {features.map((feature, index) => (
        <Text
          key={index}
          position={[
            index === 0 ? 1.51 : index === 1 ? -1.51 : 0,
            index === 2 ? 1.51 : index === 3 ? -1.51 : 0,
            index < 2 ? 0 : index === 2 ? 1.51 : -1.51
          ]}
          fontSize={0.3}
          color="#F2EBE4"
          anchorX="center"
          anchorY="middle"
          rotation={[
            index === 2 ? -Math.PI / 2 : index === 3 ? Math.PI / 2 : 0,
            index === 0 ? -Math.PI / 2 : index === 1 ? Math.PI / 2 : 0,
            0
          ]}
        >
          {feature.title}
        </Text>
      ))}
    </mesh>
  );
}
