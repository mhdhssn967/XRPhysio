import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import './PatientEfficiencyVisualizer.css';
import eff from '../assets/efficiency.png';

const PatientEfficiencyVisualizer = ({ sessionRawData = [] ,selectedSession}) => {
  
  const [model, setModel] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const textRefs = useRef([]);

  

  const SCALE_FACTOR = 3;

  // Load FBX character model
  useEffect(() => {
    const loader = new FBXLoader();
    loader.load("/models/Breathing Idle.fbx", (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.needsUpdate = true;
        }
      });
      setModel(object);
    });
  }, []);

  // Process real session data
  useEffect(() => {
    if (!selectedSession) return;

    // Get last/latest session with proper points
    const latestSession = selectedSession;
    

    const spawnPoints = latestSession.spawnPointsList || [];
    // console.log(spawnPoints);
    
    const hitCounts = latestSession.targetHitCount || [];
    const totalCounts = latestSession.targetTotalCount || [];

    const calculatedPoints = spawnPoints.map((point, idx) => {
      const touchCount = hitCounts[idx] || 0;
      const total = totalCounts[idx] || 1; // Avoid div by 0
      const efficiency = (touchCount / total) * 100;

      return {
        name: `Point ${idx + 1}`,
        position: [
      point.x * SCALE_FACTOR,
      point.y * SCALE_FACTOR,
      point.z * SCALE_FACTOR,
    ],
        touchCount,
        totalSpawns: total,
        efficiency,
        ref: React.createRef(),
      };
    });

    textRefs.current = calculatedPoints.map((p) => p.ref);
    setCoordinates(calculatedPoints);
  }, [sessionRawData]);



  const LabelsFacingCamera = () => {
    const { camera } = useThree();
    useFrame(() => {
      textRefs.current.forEach((ref) => {
        if (ref.current) {
          ref.current.quaternion.copy(camera.quaternion);
        }
      });
    });
    return null;
  };

  return (
    <div className="threeD-container">
      <h2 style={{ marginBottom: '20px' }}>3D Overview</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img width={'350px'} src={eff} alt="efficiency info" />
      </div>

      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[5, 5, 5]}
          angle={Math.PI / 6}
          penumbra={1}
          intensity={0.7}
          castShadow
        />

        <LabelsFacingCamera />

        {/* Render Efficiency Points */}
        {coordinates.map((part, index) => (
          <group key={index}>
            <group position={[
  part.position[0],
  part.position[1] - 3,  // 👈 shift downward by 1 unit
  part.position[2]+1.5]}
            >
  {/* Animated glowing sphere */}
  <AnimatedSphere efficiency={part.efficiency} />

  {/* Optional ring for high performance */}
  {part.efficiency > 80 && (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.2, 0.015, 16, 100]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
    </mesh>
  )}
</group>

            <Text
              ref={part.ref}
              position={[part.position[0], part.position[1]-3 + 0.2, part.position[2]+1.5]}
              fontSize={0.2}
              color="#f17f32"
              anchorX="center"
              anchorY="middle"
            >
              {part.efficiency.toFixed(1)}%
            </Text>
          </group>
        ))}

        {/* Character Model */}
        {model && (
          <primitive
            object={model}
            scale={[0.04, 0.04, 0.04]}
            position={[0, -3, 0]}
          />
        )}
      </Canvas>
    </div>
  );
};

export default PatientEfficiencyVisualizer;


const AnimatedSphere = ({ efficiency }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    const scale = 0.12 + Math.sin(clock.getElapsedTime() * 7) * 1;
    if (ref.current) {
      ref.current.scale.set(scale, scale, scale);
    }
  });

  const colorHue = (efficiency / 100) * 120; // 0 (red) → 120 (green)

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color={`hsl(${colorHue}, 100%, 50%)`}
        emissive={`hsl(${colorHue}, 100%, 40%)`}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
};
