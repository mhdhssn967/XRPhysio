import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import './PatientEfficiencyVisualizer.css';
import eff from '../assets/efficiency.png';
import help from '../assets/help.png'

const PatientEfficiencyVisualizer = ({ sessionRawData = [] ,selectedSession}) => {
  
  const [model, setModel] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [modelPosition,setModelPosition]=useState(true)
  const textRefs = useRef([]);

  const [mixer, setMixer] = useState(null);


  const SCALE_FACTOR = 3;

  // Load FBX character model
  useEffect(() => {
     const loader = new FBXLoader(); //
    if(!modelPosition){loader.load("/models/Breathing Idle.fbx", (object) => {
  const mixer = new THREE.AnimationMixer(object);

  // Play all animations in the file
  if (object.animations && object.animations.length > 0) {
    object.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  }

  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.needsUpdate = true;
    }
  });

  setModel(object);
  setMixer(mixer);
});

  }
else{
  loader.load("/models/Sitting Idle.fbx", (object) => {
  const mixer = new THREE.AnimationMixer(object);

  // Play all animations in the file
  if (object.animations && object.animations.length > 0) {
    object.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  }

  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.needsUpdate = true;
    }
  });

  setModel(object);
  setMixer(mixer);
});
}
}
  
  , [modelPosition]);

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


const UpdateAnimation = () => {
  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });
  return null;
};


  return (
    <div className="threeD-container">
      <div className="three-top"><h2 style={{ marginBottom: '20px' }}>3D Overview</h2>
      <div className="help"><img src={help} alt="" />
      <div className="three-d-help">
  🖱️ <strong>Controls:</strong><br />
    <ul>
      <li>Scroll or Pinch to <strong>Zoom</strong></li>
      <li>Drag to <strong>Rotate</strong></li>
      <li><kbd>Ctrl</kbd> + Mouse to <strong>Pan</strong></li>
    </ul>
</div> 
      </div>
      </div>
      
<div className="toggle-div"><p>Stand</p><div role="button" style={modelPosition?{justifyContent:'right'}:{justifyContent:'left'}} className="view-toggle-btn" onClick={()=>setModelPosition(!modelPosition)}> <div className="toggle-dot"></div></div><p>Sit</p></div>

      <Canvas camera={{ position: [-4, 2, 10], fov: 60 }}>
        <OrbitControls />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[5, 5, 5]}
          angle={Math.PI / 6}
          penumbra={1}
          intensity={0.7}
          castShadow
        />

        <LabelsFacingCamera />
<UpdateAnimation mixer={mixer} />

        {/* Render Efficiency Points */}
        {coordinates.map((part, index) => (
          <group key={index}>
            <group position={[
  part.position[0],
  part.position[1] - 1,  // 👈 shift downward by 1 unit
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
              position={[part.position[0], part.position[1]-0.8 + 0.2, part.position[2]+1.5]}
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
            position={[0, -2, 0]}
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
