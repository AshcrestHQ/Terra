import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGarden } from '../../context/GardenContext';

export const FloatingIsland: React.FC = () => {
  const { state } = useGarden();
  const waterRef = useRef<THREE.Mesh>(null);
  const waterfallRef = useRef<THREE.Mesh>(null);

  // Animated water wave surface effect
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.rotation.z = Math.sin(t * 0.5) * 0.02;
      (waterRef.current.material as THREE.MeshStandardMaterial).opacity = 0.82 + Math.sin(t * 2) * 0.05;
    }
    if (waterfallRef.current) {
      (waterfallRef.current.material as THREE.MeshStandardMaterial).roughness = 0.1 + Math.sin(t * 4) * 0.05;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* PBR Lush Grass Layer with Bump Texture Effect */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5.4, 5.2, 0.45, 64]} />
        <meshStandardMaterial
          color={state.environment === 'night' ? '#064e3b' : '#15803d'}
          roughness={0.7}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>

      {/* Rich Soil & Dirt Layer */}
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 4.4, 0.45, 48]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Layered Cliff Rock Formation (PBR Slate & Granite) */}
      <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[4.4, 1.8, 24]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.8}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Detailed Cobblestone Pathway with Specular Highlights */}
      <group position={[0, 0.23, 0]}>
        {Array.from({ length: 14 }).map((_, i) => {
          const z = -3.8 + i * 0.55;
          const xOffset = Math.sin(i * 0.45) * 0.75;
          return (
            <mesh
              key={i}
              position={[xOffset, 0, z]}
              rotation={[-Math.PI / 2, 0, (i % 3) * 0.2]}
              receiveShadow
              castShadow
            >
              <circleGeometry args={[0.22 + (i % 3) * 0.04, 12]} />
              <meshStandardMaterial
                color="#64748b"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          );
        })}
      </group>

      {/* Central PBR Water Pond / Fountain Pool with Reflections */}
      <group position={[0, 0.23, -2.6]}>
        {/* Stone Rim */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.9, 0.14, 16, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Animated Water Surface */}
        <mesh ref={waterRef} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.88, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.05}
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Water Spout Crystal Centerpiece */}
        <mesh position={[0, 0.4, 0]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#0284c7"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>

        {/* Light Glow under water */}
        <pointLight position={[0, 0.3, 0]} intensity={1.2} distance={3} color="#38bdf8" />
      </group>

      {/* Peripheral PBR Boulders & Moss Rocks */}
      <mesh position={[-4.2, 0.35, -2.2]} rotation={[0.4, 0.2, 0.1]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.45, 2]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[4.4, 0.35, 2.0]} rotation={[-0.2, 0.5, 0.3]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>

      {/* Floating Satellite Islets around main island */}
      <group position={[-6.8, -1.2, -3.2]}>
        <mesh rotation={[0.2, 0.3, 0.4]} castShadow>
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        {/* Tiny Sprout on satellite rock */}
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.1, 0.3, 6]} />
          <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.4} />
        </mesh>
      </group>

      <group position={[7.0, -0.9, 3.5]}>
        <mesh rotation={[-0.3, 0.1, 0.5]} castShadow>
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
