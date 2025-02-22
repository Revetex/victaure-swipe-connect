
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import type { Mesh } from 'three';
import { features } from "./featureData";

interface FeatureBoxProps {
  position: [number, number, number];
}

export function FeatureBox({ position }: FeatureBoxProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Center position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#1B2A4A" />
        <mesh position={[0, 0, 1.51]}>
          <planeGeometry args={[2, 0.5]} />
          <meshStandardMaterial color="#64B5D9" transparent opacity={0.2} />
        </mesh>
      </mesh>
    </Center>
  );
}
