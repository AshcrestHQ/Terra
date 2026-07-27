'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useHabitStore, Plant, GrowthStage } from '@/store/useHabitStore';

interface PlantProps {
  plant: Plant;
}

const Plant3DNode: React.FC<PlantProps> = ({ plant }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle wind sway animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const px = plant.position[0];
      groupRef.current.rotation.z = Math.sin(t * 1.8 + px) * 0.04;
      groupRef.current.rotation.x = Math.cos(t * 1.2 + px) * 0.03;
    }
  });

  return (
    <group
      ref={groupRef}
      position={plant.position}
      scale={[plant.scaleMultiplier, plant.scaleMultiplier, plant.scaleMultiplier]}
    >
      {/* Terracotta Pot Base */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.18, 24]} />
        <meshStandardMaterial color="#9a3412" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[0.43, 0.42, 0.02, 24]} />
        <meshStandardMaterial color="#3d2817" roughness={0.95} />
      </mesh>

      {/* Render 3D Model according to Growth Stage */}
      {renderStageMesh(plant.stage)}
    </group>
  );
};

const renderStageMesh = (stage: GrowthStage) => {
  switch (stage) {
    case 'SEED':
      return (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#854d0e" roughness={0.7} />
          </mesh>
        </group>
      );
    case 'SPROUT':
      return (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.4, 12]} />
            <meshStandardMaterial color="#22c55e" roughness={0.4} />
          </mesh>
          <mesh position={[0.12, 0.35, 0]} rotation={[0, 0, -0.6]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#4ade80" roughness={0.3} />
          </mesh>
          <mesh position={[-0.12, 0.35, 0]} rotation={[0, 0, 0.6]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#34d399" roughness={0.3} />
          </mesh>
        </group>
      );
    case 'SAPLING':
      return (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.7, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.35, 2]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
          <mesh position={[0.2, 0.65, 0.1]} castShadow>
            <dodecahedronGeometry args={[0.22, 2]} />
            <meshStandardMaterial color="#22c55e" roughness={0.6} />
          </mesh>
        </group>
      );
    case 'MATURE':
      return (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.2, 1.0, 16]} />
            <meshStandardMaterial color="#582f0e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.55, 2]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
          <mesh position={[-0.3, 0.9, 0.2]} castShadow>
            <dodecahedronGeometry args={[0.38, 2]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
          <mesh position={[0.3, 0.95, -0.2]} castShadow>
            <dodecahedronGeometry args={[0.38, 2]} />
            <meshStandardMaterial color="#22c55e" roughness={0.5} />
          </mesh>
        </group>
      );
    case 'BLOOMING':
    default:
      return (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.26, 1.2, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.65, 2]} />
            <meshStandardMaterial
              color="#f472b6"
              roughness={0.3}
              emissive="#ec4899"
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh position={[-0.4, 1.1, 0.3]} castShadow>
            <dodecahedronGeometry args={[0.42, 2]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.3} />
          </mesh>
          <mesh position={[0.4, 1.15, -0.3]} castShadow>
            <dodecahedronGeometry args={[0.45, 2]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
          <pointLight position={[0, 1.3, 0]} intensity={1.5} distance={3.5} color="#f472b6" />
        </group>
      );
  }
};

const FloatingIsland3D = () => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Top Grass Level */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5.2, 5.0, 0.45, 64]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      {/* Dirt Base */}
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[5.0, 4.2, 0.45, 48]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      {/* Rocky Cliff Underside */}
      <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[4.2, 1.7, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.85} flatShading />
      </mesh>
      {/* Cobblestone Path */}
      <group position={[0, 0.23, 0]}>
        {Array.from({ length: 10 }).map((_, i) => {
          const z = -3.5 + i * 0.7;
          return (
            <mesh key={i} position={[Math.sin(i * 0.5) * 0.6, 0, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[0.24, 12]} />
              <meshStandardMaterial color="#64748b" roughness={0.7} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

export const GardenScene: React.FC = () => {
  const { plants, environment } = useHabitStore();

  const getEnvConfig = () => {
    switch (environment) {
      case 'sunset':
        return { bg: '#1e1b4b', sunColor: '#f97316', sunPos: [10, 6, 10] as [number, number, number], preset: 'sunset' as const };
      case 'night':
        return { bg: '#020617', sunColor: '#818cf8', sunPos: [-8, 10, -8] as [number, number, number], preset: 'night' as const };
      case 'day':
      default:
        return { bg: '#0f172a', sunColor: '#fef08a', sunPos: [12, 14, 12] as [number, number, number], preset: 'city' as const };
    }
  };

  const config = getEnvConfig();

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas shadows camera={{ position: [0, 6.5, 11.5], fov: 45 }}>
        <color attach="background" args={[config.bg]} />

        <ambientLight intensity={0.9} />
        <directionalLight
          position={config.sunPos}
          intensity={2.2}
          color={config.sunColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <hemisphereLight args={['#38bdf8', '#14532d', 0.6]} />

        {/* Floating Earth Island */}
        <FloatingIsland3D />

        {/* 3D Plants */}
        {plants.map((plant) => (
          <Plant3DNode key={plant.id} plant={plant} />
        ))}

        {/* R3F Drei Environment lighting */}
        <Environment preset={config.preset} />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3.8}
          maxDistance={24}
        />
      </Canvas>
    </div>
  );
};

export default GardenScene;
