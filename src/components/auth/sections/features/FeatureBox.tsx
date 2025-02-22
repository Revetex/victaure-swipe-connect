
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from 'three';
import { features } from "./featureData";

interface FeatureBoxProps {
  position: [number, number, number];
}

export function FeatureBox({ position }: FeatureBoxProps) {
  const meshRef = useRef<Mesh>(null);

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
    >
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#1B2A4A" />
      {features.map((feature, index) => {
        const textPosition: [number, number, number] = [
          index === 0 ? 1.51 : index === 1 ? -1.51 : 0,
          index === 2 ? 1.51 : index === 3 ? -1.51 : 0,
          index < 2 ? 0 : index === 2 ? 1.51 : -1.51
        ];
        
        const textRotation: [number, number, number] = [
          index === 2 ? -Math.PI / 2 : index === 3 ? Math.PI / 2 : 0,
          index === 0 ? -Math.PI / 2 : index === 1 ? Math.PI / 2 : 0,
          0
        ];

        return (
          <Text
            key={index}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.ttf"
            position={textPosition}
            rotation={textRotation}
            fontSize={0.3}
            color="#F2EBE4"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
            textAlign="center"
          >
            {feature.title}
          </Text>
        );
      })}
    </mesh>
  );
}
