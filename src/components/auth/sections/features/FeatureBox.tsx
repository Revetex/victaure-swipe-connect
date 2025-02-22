
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Center, useFont } from "@react-three/drei";
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
        <group position={[0, 0, 1.51]}>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.3}
            color="#64B5D9"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
          >
            {features[0].title}
          </Text>
        </group>
      </mesh>
    </Center>
  );
}
