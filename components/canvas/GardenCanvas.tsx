"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGarden } from '../../context/GardenContext';
import { FloatingIsland } from './FloatingIsland';
import { Plant3D } from './3DPlants';
import { WeatherParticles } from './WeatherParticles';

export const GardenCanvas: React.FC = () => {
  const { plants, state, setSelectedPlantId } = useGarden();

  // Advanced Global Illumination & Dynamic Day/Night Lighting parameters
  const getLighting = () => {
    switch (state.environment) {
      case 'sunset':
        return {
          bgColor: '#1e1b4b',
          ambientColor: '#fed7aa',
          ambientIntensity: 0.9,
          sunColor: '#f97316',
          sunPos: [10, 6, 10] as [number, number, number],
          sunIntensity: 2.6,
          hemisphereSky: '#fb923c',
          hemisphereGround: '#431407',
          rimColor: '#fdba74',
        };
      case 'night':
        return {
          bgColor: '#020617',
          ambientColor: '#38bdf8',
          ambientIntensity: 0.55,
          sunColor: '#818cf8',
          sunPos: [-8, 10, -8] as [number, number, number],
          sunIntensity: 1.4,
          hemisphereSky: '#1e1b4b',
          hemisphereGround: '#020617',
          rimColor: '#c084fc',
        };
      case 'day':
      default:
        return {
          bgColor: '#0f172a',
          ambientColor: '#ffffff',
          ambientIntensity: 1.0,
          sunColor: '#fef08a',
          sunPos: [12, 14, 12] as [number, number, number],
          sunIntensity: 2.4,
          hemisphereSky: '#38bdf8',
          hemisphereGround: '#14532d',
          rimColor: '#34d399',
        };
    }
  };

  const lights = getLighting();

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 6.5, 11.5], fov: 45 }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedPlantId(null);
          }
        }}
      >
        <color attach="background" args={[lights.bgColor]} />

        {/* Global Illumination Hemisphere Light (Sky/Ground Blend) */}
        <hemisphereLight
          args={[lights.hemisphereSky, lights.hemisphereGround, 0.8]}
        />

        {/* Main Ambient Fill Light */}
        <ambientLight color={lights.ambientColor} intensity={lights.ambientIntensity} />

        {/* Dynamic Sun/Moon Directional Light with High-Res Soft Shadows */}
        <directionalLight
          position={lights.sunPos}
          intensity={lights.sunIntensity}
          color={lights.sunColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={35}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
          shadow-bias={-0.0001}
        />

        {/* Rim Light for Organic Highlighting & Edge Depth */}
        <directionalLight
          position={[-lights.sunPos[0], lights.sunPos[1], -lights.sunPos[2]]}
          intensity={0.6}
          color={lights.rimColor}
        />

        {/* Center Glow Point Light */}
        <pointLight position={[0, 4.5, 0]} intensity={0.8} color="#34d399" distance={10} />

        {/* Floating 3D Earth Island with PBR Materials & Water */}
        <FloatingIsland />

        {/* Planted 3D PBR Flora */}
        {plants.map((plant) => (
          <Plant3D key={plant.id} plant={plant} />
        ))}

        {/* Volumetric Fog & Atmospheric Weather Particles */}
        <WeatherParticles />

        {/* Smooth Camera Viewport Orbit Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3.8}
          maxDistance={24}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};
