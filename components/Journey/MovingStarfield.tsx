'use client';

import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

/**
 * MovingStars component that creates an animated starfield with forward movement effect.
 *
 * Creates a dynamic starfield that simulates traveling through space at high speed.
 * Stars move towards the camera and reset their position when they pass through,
 * creating an infinite tunnel effect.
 *
 * @component
 * @returns JSX element representing animated moving stars
 */
const MovingStarfield = () => {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const initializedRef = useRef(false);

  useFrame(() => {
    // Initialize positions once
    if (!initializedRef.current && group1Ref.current && group2Ref.current) {
      group1Ref.current.position.z = 0;
      group2Ref.current.position.z = -300;
      initializedRef.current = true;
    }

    // Move both groups forward at the same speed
    if (group1Ref.current) {
      group1Ref.current.position.z += 0.3;

      // Reset first group when it goes too far forward
      if (group1Ref.current.position.z > 300) {
        group1Ref.current.position.z = -300;
      }
    }

    if (group2Ref.current) {
      group2Ref.current.position.z += 0.3;

      // Reset second group when it goes too far forward
      if (group2Ref.current.position.z > 300) {
        group2Ref.current.position.z = -300;
      }
    }
  });

  return (
    <>
      {/* First group of stars */}
      <group ref={group1Ref}>
        <Stars radius={200} depth={400} count={2000} factor={2} saturation={0} speed={0} />
        <Stars radius={120} depth={250} count={1500} factor={3} saturation={0.3} speed={0} />
        <Stars radius={100} depth={150} count={500} factor={5} saturation={0.1} speed={0} />
      </group>

      {/* Second group of stars - offset to create seamless loop */}
      <group ref={group2Ref}>
        <Stars radius={200} depth={400} count={2000} factor={2} saturation={0} speed={0} />
        <Stars radius={120} depth={250} count={1500} factor={3} saturation={0.3} speed={0} />
        <Stars radius={100} depth={150} count={500} factor={5} saturation={0.1} speed={0} />
      </group>
    </>
  );
};

export default MovingStarfield;
