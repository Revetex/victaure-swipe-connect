
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import type { Mesh } from 'three';

interface FeatureBoxProps {
  position: [number, number, number];
}

export function FeatureBox({ position }: FeatureBoxProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Center position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#1B2A4A" roughness={0.5} metalness={0.5} />
      </mesh>
    </Center>
  );
}
