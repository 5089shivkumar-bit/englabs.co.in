"use client";
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, PerspectiveCamera, Float, MeshDistortMaterial } from "@react-three/drei";
import { Loader2 } from "lucide-react";

function LockModel() {
  const meshRef = useRef<any>();

  // Self-rotation logic for cinematic effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Core Cylinder (Lock Body) */}
        <cylinderGeometry args={[1, 1, 4, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        
        {/* Biometric Scanner Plate */}
        <mesh position={[0, 1, 1.05]}>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#111" />
          
          {/* Glowing Scanner Ring */}
          <mesh position={[0, 0, 0.06]}>
            <ringGeometry args={[0.2, 0.25, 32]} />
            <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={2} />
          </mesh>
        </mesh>

        {/* Handle Structure */}
        <mesh position={[0, -0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />
          <meshStandardMaterial color="#333" metalness={1} roughness={0.05} />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function ProductViewer3D() {
  return (
    <div className="w-full h-full min-h-[400px] relative bg-black/20 rounded-[2.5rem] overflow-hidden border border-white/5">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      }>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={["#050505"]} />
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          
          <Stage environment="city" intensity={0.6} contactShadow={{ opacity: 0.7, blur: 2 }}>
            <LockModel />
          </Stage>

          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.5} 
            makeDefault
          />
        </Canvas>
      </Suspense>

      {/* Premium UI Overlay */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <div className="px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/70 italic">3D Telemetry Active</span>
        </div>
      </div>
    </div>
  );
}
