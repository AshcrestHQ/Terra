import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantInstance } from '../../types';
import { PLANT_SPECIES_LIST } from '../../types';
import { useGarden } from '../../context/GardenContext';

interface Plant3DProps {
  plant: PlantInstance;
}

export const Plant3D: React.FC<Plant3DProps> = ({ plant }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { state, setSelectedPlantId } = useGarden();
  const isSelected = state.selectedPlantId === plant.id;

  const species = PLANT_SPECIES_LIST.find((s) => s.id === plant.speciesId) || PLANT_SPECIES_LIST[0];

  // Natural organic wind sway animation with dual-frequency wave modulation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const posX = plant.position[0];
      const posZ = plant.position[2];

      // Wind sway on X/Z axes
      groupRef.current.rotation.z = Math.sin(t * 1.8 + posX * 0.5) * 0.05 + Math.cos(t * 0.8) * 0.02;
      groupRef.current.rotation.x = Math.cos(t * 1.4 + posZ * 0.5) * 0.04 + Math.sin(t * 0.6) * 0.02;
    }
  });

  const scaleMultiplier = 0.55 + plant.stage * 0.28;

  return (
    <group
      ref={groupRef}
      position={plant.position}
      scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPlantId(plant.id);
      }}
    >
      {/* PBR Terracotta Flower Pot */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.36, 0.18, 24]} />
        <meshStandardMaterial color="#9a3412" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Rich Potting Soil Surface */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[0.45, 0.44, 0.02, 24]} />
        <meshStandardMaterial color="#271c19" roughness={0.95} />
      </mesh>

      {/* Selection Holographic Aura */}
      {isSelected && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.75, 32]} />
            <meshBasicMaterial color="#34d399" side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={2.0} color="#34d399" distance={2} />
        </group>
      )}

      {/* 3D PBR Species Model Render */}
      {renderSpeciesPBRModel(plant.speciesId, plant.stage, species.color)}
    </group>
  );
};

const renderSpeciesPBRModel = (speciesId: string, stage: number, color: string) => {
  const isBlooming = stage >= 4;

  switch (speciesId) {
    case 'sprout':
      return (
        <group position={[0, 0.15, 0]}>
          {/* Detailed Curved Stem */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.45, 12]} />
            <meshStandardMaterial color="#22c55e" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Detailed Leaf Vein Structure */}
          <mesh position={[0.14, 0.38, 0]} rotation={[0, 0, -0.6]} castShadow receiveShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#4ade80" roughness={0.2} metalness={0.05} />
          </mesh>
          <mesh position={[-0.14, 0.38, 0]} rotation={[0, 0, 0.6]} castShadow receiveShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#34d399" roughness={0.2} metalness={0.05} />
          </mesh>
          {isBlooming && (
            <mesh position={[0, 0.5, 0]} castShadow>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={0.6} />
            </mesh>
          )}
        </group>
      );

    case 'sunflower':
      return (
        <group position={[0, 0.15, 0]}>
          {/* PBR Stem with Leaf Nodes */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.09, 1.1, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
          {/* Textured Seed Disc Head */}
          <mesh position={[0, 1.1, 0.09]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.09, 24]} />
            <meshStandardMaterial color="#3f1d0b" roughness={0.9} />
          </mesh>
          {/* Radial Layered Golden Petals */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.32, 1.1 + Math.sin(angle) * 0.32, 0.06]}
                rotation={[0, 0, angle]}
                castShadow
              >
                <coneGeometry args={[0.09, 0.38, 5]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  roughness={0.2}
                  emissive="#f59e0b"
                  emissiveIntensity={0.25}
                />
              </mesh>
            );
          })}
        </group>
      );

    case 'bonsai':
      return (
        <group position={[0, 0.15, 0]}>
          {/* PBR Twisted Trunk Bark */}
          <mesh position={[0, 0.35, 0]} rotation={[0.12, 0, -0.25]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.2, 0.7, 12]} />
            <meshStandardMaterial color="#582f0e" roughness={0.85} metalness={0.05} />
          </mesh>
          <mesh position={[-0.12, 0.7, 0]} rotation={[-0.2, 0, 0.35]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.11, 0.55, 12]} />
            <meshStandardMaterial color="#582f0e" roughness={0.85} />
          </mesh>
          {/* Lush Cloud Canopy Clusters */}
          <mesh position={[-0.28, 1.0, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.34, 2]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          <mesh position={[0.18, 0.88, 0.12]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.28, 2]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.4, 2]} />
            <meshStandardMaterial color="#22c55e" roughness={0.6} />
          </mesh>
        </group>
      );

    case 'rose':
      return (
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.07, 0.8, 12]} />
            <meshStandardMaterial color="#064e3b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.25, 2]} />
            <meshStandardMaterial
              color="#e11d48"
              roughness={0.25}
              emissive="#be123c"
              emissiveIntensity={0.3}
            />
          </mesh>
          {stage >= 2 && (
            <mesh position={[0.22, 0.68, 0.12]} scale={0.75} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.2, 2]} />
              <meshStandardMaterial color="#f43f5e" roughness={0.25} />
            </mesh>
          )}
        </group>
      );

    case 'cherry':
      return (
        <group position={[0, 0.15, 0]}>
          {/* Sakura Tree Wood Trunk */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.14, 0.25, 1.0, 12]} />
            <meshStandardMaterial color="#451a03" roughness={0.8} />
          </mesh>
          {/* Sakura Blossom Petal Clouds */}
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.58, 2]} />
            <meshStandardMaterial
              color="#f472b6"
              roughness={0.35}
              emissive="#ec4899"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[-0.35, 0.95, 0.22]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.38, 2]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.35} />
          </mesh>
          <mesh position={[0.35, 1.0, -0.22]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.42, 2]} />
            <meshStandardMaterial color="#f472b6" roughness={0.35} />
          </mesh>
        </group>
      );

    case 'cactus':
      return (
        <group position={[0, 0.15, 0]}>
          {/* Saguaro Desert Body */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.2, 0.7, 10, 20]} />
            <meshStandardMaterial color="#0891b2" roughness={0.35} metalness={0.1} />
          </mesh>
          <mesh position={[0.22, 0.45, 0]} rotation={[0, 0, -0.5]} castShadow receiveShadow>
            <capsuleGeometry args={[0.09, 0.35, 8, 16]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.35} />
          </mesh>
          {/* Golden Desert Bloom */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <dodecahedronGeometry args={[0.12, 2]} />
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.7} />
          </mesh>
        </group>
      );

    case 'crystal':
      return (
        <group position={[0, 0.15, 0]}>
          {/* Translucent Glowing PBR Crystal Shards */}
          <mesh position={[0, 0.45, 0]} rotation={[0.2, 0.4, 0.1]} castShadow>
            <octahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial
              color="#c084fc"
              roughness={0.05}
              metalness={0.2}
              emissive="#9333ea"
              emissiveIntensity={0.9}
            />
          </mesh>
          <mesh position={[-0.18, 0.35, 0.18]} rotation={[-0.3, 0.1, -0.2]} castShadow>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#e879f9"
              roughness={0.05}
              emissive="#c084fc"
              emissiveIntensity={0.9}
            />
          </mesh>
          <mesh position={[0.18, 0.3, -0.12]} rotation={[0.4, -0.2, 0.3]} castShadow>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.05}
              emissive="#0284c7"
              emissiveIntensity={0.9}
            />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={1.5} distance={2.5} color="#c084fc" />
        </group>
      );

    case 'goldenoak':
      return (
        <group position={[0, 0.15, 0]}>
          {/* Shimmering Golden Trunk */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.32, 1.3, 16]} />
            <meshStandardMaterial color="#92400e" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Shimmering Golden Oak Foliage */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <dodecahedronGeometry args={[0.7, 2]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.15}
              metalness={0.3}
              emissive="#eab308"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[-0.45, 1.2, 0.35]} castShadow>
            <dodecahedronGeometry args={[0.48, 2]} />
            <meshStandardMaterial
              color="#fde047"
              roughness={0.15}
              emissive="#ca8a04"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.45, 1.25, -0.35]} castShadow>
            <dodecahedronGeometry args={[0.48, 2]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.15}
              emissive="#eab308"
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight position={[0, 1.4, 0]} intensity={2.2} distance={4} color="#fef08a" />
        </group>
      );

    default:
      return (
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.45, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
};
