"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Suspense, useRef } from "react";
import * as THREE from "three";

useGLTF.preload("/models/JBL_GO4.glb")

function Model() {
  const gltf = useLoader(GLTFLoader, "/models/JBL_GO4.glb", (loader) => {
    loader.load(
      "/models/JBL_GO4.glb", // The path to the model
      (gltf) => {
        // This will run once the model has been successfully loaded
        console.log("Model loaded successfully", gltf);
      },
      undefined, // You can add a progress callback here if needed
      (error) => {
        // This will run if there's an error loading the model
        console.error("Error loading the model", error);
      }
    );
  });
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
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
