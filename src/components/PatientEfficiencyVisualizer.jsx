import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import './PatientEfficiencyVisualizer.css';
import eff from '../assets/efficiency.png';


const PatientEfficiencyVisualizer = () => {
  const [model, setModel] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const textRefs = useRef([]);


  useEffect(() => {
    const loader = new FBXLoader();
    loader.load("/models/uploads_files_3915069_male.fbx", (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.needsUpdate = true;
        }
      });
      setModel(object);
    });



  


    const points = [
      { name: "Point 1", position: [2, 0, 2] },
      { name: "Point 2", position: [-2, 0, 2] },
      { name: "Point 3", position: [2, 0, -2] },
      { name: "Point 4", position: [-2, 0, -2] },
      { name: "Point 5", position: [0, 0, 3] },
      { name: "Point 6", position: [0, 0, -3] },
      { name: "Point 7", position: [3, 0, 0] },
      { name: "Point 8", position: [-3, 0, 0] },
      { name: "Point 9", position: [0, 3, 2] },
      { name: "Point 10", position: [0, 2, 0] },
    ];

    const newCoordinates = points.map((point, index) => {
      const touchCount = Math.floor(Math.random() * 6);
      const totalSpawns = 5 + Math.floor(Math.random() * 2);
      const efficiency = (touchCount / totalSpawns) * 100;
      return {
        ...point,
        touchCount,
        totalSpawns,
        efficiency,
        ref: React.createRef(),
      };
    });

    textRefs.current = newCoordinates.map(c => c.ref);
    setCoordinates(newCoordinates);
  }, []);

  const getDotSize = (efficiency) => 1;

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
        <img width={'350px'} src={eff} alt="" />
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

        {coordinates.map((part, index) => (
          <group key={index}>
            <mesh
              position={part.position}
              scale={[
                getDotSize(part.efficiency),
                getDotSize(part.efficiency),
                getDotSize(part.efficiency),
              ]}
            >
              <sphereGeometry args={[0.1, 32, 32]} />
              <meshStandardMaterial
                color={`hsl(${(1 + part.efficiency / 100) * 120}, 100%, 50%)`}
                emissive={`hsl(${(1 + part.efficiency / 100) * 120}, 100%, 50%)`}
                emissiveIntensity={0.5}
              />
            </mesh>

            <Text
              ref={part.ref}
              position={[
                part.position[0],
                part.position[1] + 0.2,
                part.position[2],
              ]}
              fontSize={0.2}
              color="#f17f32"
              anchorX="center"
              anchorY="middle"
            >
              {part.efficiency.toFixed(1)}%
            </Text>
          </group>
        ))}

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
