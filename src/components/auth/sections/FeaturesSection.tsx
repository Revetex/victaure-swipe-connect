
import { motion } from "framer-motion";
import { Bot, Wrench, Users, Timer } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from 'three';

const features = [
  {
    icon: Users,
    title: "Gratuit",
    description: "Pour chercheurs d'emploi"
  },
  {
    icon: Bot,
    title: "IA innovante",
    description: "Outils d'IA spécialisés"
  },
  {
    icon: Wrench,
    title: "Suite complète",
    description: "CV, lettres, analyses"
  },
  {
    icon: Timer,
    title: "Flexibilité",
    description: "Sans engagement"
  }
];

function Box(props: any) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
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

export function FeaturesSection() {
  return (
    <div className="h-[300px] w-full">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
