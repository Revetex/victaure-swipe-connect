
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Center } from "@react-three/drei";
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
        {features.map((feature, index) => (
          <Text
            key={index}
            position={[0, 0, 1.51]}
            rotation={[0, 0, 0]}
            fontSize={0.3}
            color="#F2EBE4"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
          >
            {feature.title}
          </Text>
        ))}
      </mesh>
    </Center>
  );
}
