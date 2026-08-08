"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGarden } from '../../context/GardenContext';

export const WeatherParticles: React.FC = () => {
  const { state } = useGarden();
  const pointsRef = useRef<THREE.Points>(null);
  const fogPointsRef = useRef<THREE.Points>(null);

  const particleCount = state.weather === 'rain' ? 400 : state.weather === 'magic' ? 250 : 180;
  const fogCount = 80;

  // Weather Particles Buffer (Rain, Fireflies, Sakura Petals, Sun Dust)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      if (state.weather === 'rain') {
        // Rain droplets (cyan blue)
        cols[i * 3] = 0.35;
        cols[i * 3 + 1] = 0.75;
        cols[i * 3 + 2] = 1.0;
      } else if (state.weather === 'magic' || state.environment === 'night') {
        // Glowing Fireflies (neon green/violet)
        cols[i * 3] = 0.65;
        cols[i * 3 + 1] = 0.95;
        cols[i * 3 + 2] = 0.4;
      } else {
        // Floating Sakura Petals & Golden Sun Particles
        if (i % 2 === 0) {
          cols[i * 3] = 0.96; // Sakura Pink
          cols[i * 3 + 1] = 0.65;
          cols[i * 3 + 2] = 0.8;
        } else {
          cols[i * 3] = 1.0; // Warm Golden Sun Dust
          cols[i * 3 + 1] = 0.9;
          cols[i * 3 + 2] = 0.45;
        }
      }
    }
    return [pos, cols];
  }, [particleCount, state.weather, state.environment]);

  // Low-lying Volumetric Fog Haze Buffer
  const fogPositions = useMemo(() => {
    const pos = new Float32Array(fogCount * 3);
    for (let i = 0; i < fogCount; i++) {
      const radius = 3 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -0.5 + Math.random() * 1.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [fogCount]);

  useFrame((stateCtx, delta) => {
    const time = stateCtx.clock.getElapsedTime();

    // Animate Weather Particles
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        if (state.weather === 'rain') {
          posArray[i * 3 + 1] -= delta * 14;
          posArray[i * 3] += Math.sin(time + i) * 0.01;
          if (posArray[i * 3 + 1] < -0.6) {
            posArray[i * 3 + 1] = 12;
          }
        } else {
          // Floating Swirl Motion for Petals / Fireflies
          posArray[i * 3 + 1] += Math.sin(time * 1.5 + i) * 0.006;
          posArray[i * 3] += Math.cos(time * 0.8 + i) * 0.005;
          posArray[i * 3 + 2] += Math.sin(time * 0.6 + i) * 0.005;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Low-lying Volumetric Fog Mist
    if (fogPointsRef.current) {
      fogPointsRef.current.rotation.y = time * 0.03;
    }
  });

  return (
    <group>
      {/* Weather Particles (Rain / Petals / Fireflies) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={state.weather === 'rain' ? 0.09 : 0.16}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Volumetric Fog Mist Particles */}
      <points ref={fogPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fogPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color={state.environment === 'night' ? '#1e1b4b' : '#f0fdf4'}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
