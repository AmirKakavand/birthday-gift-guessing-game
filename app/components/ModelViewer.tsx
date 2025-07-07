"use client";

import { Canvas, ObjectMap, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

useGLTF.preload("/models/bluetooth_speaker_jbl_go4.glb")

interface ModelProps {
  gltf: GLTF & ObjectMap
}

function Model({gltf}: ModelProps) {
  
  const modelRef = useRef<THREE.Group>(null);

  // Apply continuous rotation on the z-axis
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005; // Rotation on Y-axis
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={1}
      position={[0, -0.05, 0]}
    />
  );
}

export default function ModelViewer() {
  const gltf = useLoader(GLTFLoader, "/models/bluetooth_speaker_jbl_go4.glb")
  useEffect(() => {
    useGLTF.preload("/models/bluetooth_speaker_jbl_go4.glb")
    console.log(gltf)
  }, [gltf])
  return (
    <Canvas
      camera={{ position: [0.5, 0.2, -1], fov: 18 }}
      style={{ background: "#5F6F65", width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={1.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Optional: hemisphere light for balanced soft light */}
      <hemisphereLight intensity={1} groundColor="white" />

      {/* 🌌 Stars in the background */}
      <Stars
        radius={10} // How far away the stars are
        depth={60} // Star field depth
        count={8000} // Number of stars
        factor={3} // Star size factor
        saturation={0}
        fade // Fades stars near edges
        speed={3} // Optional animation speed
      />
      <Suspense fallback={null}>
        <Model gltf={gltf} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
