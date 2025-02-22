
import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from 'three';
import { features } from "./featureData";
import * as THREE from 'three';

extend(THREE);

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
      {features.map((feature, index) => (
        <group key={index}>
          <Text
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
        </group>
      ))}
    </mesh>
  );
}
