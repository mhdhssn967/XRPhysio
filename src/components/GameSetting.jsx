import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import './GameSetting.css';
import { Box, Stack, Typography, Slider, Select, MenuItem, FormControl, InputLabel, TextField, Button } from "@mui/material";
import { fetchPatientId, fetchSpawnPointList, setApplyPositionsTrue, updateGameSettings } from "../firebase/helpers";
import Swal from 'sweetalert2';


const GameSetting = ({setOpenSettings,user,selectedDeviceId}) => {


   const defaultPoints = [
  {
    name: "1",
    position: [-0.5991023778915405, 1.4097106456756592, 0.343999981880188],
    efficiency: 0,
    ref: React.createRef(),
  },
  {
    name: "2",
    position: [-0.2951023578643799, 1.4097106456756592, 0.343999981880188],
    efficiency: 0,
    ref: React.createRef(),
  },
  {
    name: "3",
    position: [-0.02610236406326294, 1.4097106456756592, 0.343999981880188],
    efficiency: 0,
    ref: React.createRef(),
  },
  {
    name: "4",
    position: [0.2548976540565491, 1.4097106456756592, 0.343999981880188],
    efficiency: 0,
    ref: React.createRef(),
  },
];
   const [model, setModel] = useState(null);
  const [coordinates, setCoordinates] = useState(defaultPoints);
  const [modelPosition,setModelPosition]=useState(true)
  const [lines,setLines]=useState(false)
  const textRefs = useRef([]);
  const [selectedPoint,setSelectedPoint]=useState(1)

 
const visualScale = 4;



const [clickedDetails,setClickedDetails] = useState({})


useEffect(() => {
    const getPatientId = async () => {
      if (!user || !selectedDeviceId) return;

      const clickedPatientDataRef = await fetchPatientId(user, selectedDeviceId);
      setClickedDetails(clickedPatientDataRef)
    };

    getPatientId();
  }, [user, selectedDeviceId]);

 
   const loadPreviousSpawnPointList = async () => {
  try {
    const points = await fetchSpawnPointList(
      user,
      clickedDetails.patientId,
      clickedDetails.gameSetName
    );

    if (points && Array.isArray(points)) {
      const mappedPoints = points.map((p, index) => ({
        name: (index + 1).toString(),
        position: [p.x, p.y, p.z],
        efficiency: 0,
        ref: React.createRef(),
      }));

      setCoordinates(mappedPoints);
    }
  } catch (error) {
    console.error("Error loading points:", error);
  }
};



 

  
  

const [allSetting, setAllSetting] = useState({
  handSelected: "Right",
  totalRepCount: 2, 
  x0: -0.5991023778915405,
  y0: 1.4097106456756592,
  z0: 0.343999981880188,
  x1: -0.2951023578643799,
  y1: 1.4097106456756592,
  z1: 0.343999981880188,
  x2: -0.02610236406326294,
  y2: 1.4097106456756592,
  z2: 0.343999981880188,
  x3: 0.2548976540565491,
  y3: 1.4097106456756592,
  z3: 0.343999981880188,
  applySettings: true,
  ToggleMR:false,
  spawningGap:8
});




  
  

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

const applySetting = async () => {
  const result = await Swal.fire({
    title: 'Apply Settings?',
    text: "Are you sure you want to apply these settings?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, apply',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await updateGameSettings(user, selectedDeviceId, allSetting);
      setOpenSettings(false);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Settings applied successfully',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to apply settings',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }
};

const UpdateAnimation = () => {
  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });
  return null;
};

const applyPositions = async () => {
  // First run your API call
  await setApplyPositionsTrue(user, selectedDeviceId);

  // Then update your state
  setAllSetting((prev) => {
    let updated = { ...prev };

    coordinates.forEach((point, index) => {
      updated[`x${index}`] = point.position[0];
      updated[`y${index}`] = point.position[1];
      updated[`z${index}`] = point.position[2];
    });

    return updated;
  });
};

  return (
    <div className="setting-container">
        <div className="threeD-container-setting">
         
          
    <div className="three-d-btns-div-setting">
        
        <h3>Set Positions</h3>
      <div>
          <div className="toggle-div"><p>Stand</p><div role="button" style={modelPosition?{justifyContent:'right'}:{justifyContent:'left'}} className="view-toggle-btn" onClick={()=>setModelPosition(!modelPosition)}> <div className="toggle-dot"></div></div><p>Sit</p></div>
        
          <div className="toggle-div"><p>Lines</p><div role="button" style={lines?{justifyContent:'right'}:{justifyContent:'left'}} className="view-toggle-btn" onClick={()=>setLines(!lines)}> <div className="toggle-dot" style={lines?{backgroundColor:''}:{backgroundColor:'gray'}}></div></div></div>
      </div>
    </div>
    
    
          <Canvas camera={{ position: [-6, 8, 12], fov: 80 }}>
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
  coordinates[index].position[0] * visualScale,
  coordinates[index].position[1] * visualScale - 2.3,
  coordinates[index].position[2] * visualScale + 1.5
]}>
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
    
    {/* Lines */}
    {lines&&coordinates.map((part, index) => {
      const start = new THREE.Vector3(0, 2, 0); // model's head or chest height
    
      const end = new THREE.Vector3(
        coordinates[index].position[0] * visualScale,
  coordinates[index].position[1] * visualScale - 2.3,
  coordinates[index].position[2] * visualScale + 1.5               // Z (offset)
      );
    
      const points = [start, end];
    
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    
      return (
        <line key={`line-${index}`} geometry={lineGeometry}>
          <lineBasicMaterial attach="material" color="rgb(95, 176, 243)" linewidth={1} />
        </line>
      );
    })}
    
                <Text
  ref={part.ref}
  position={[
    coordinates[index].position[0] * visualScale,
  coordinates[index].position[1] * visualScale - 1.7,
  coordinates[index].position[2] * visualScale + 1.5
  ]}
  fontSize={0.2}
  color="rgb(44, 53, 61)"
  anchorX="center"
  anchorY="middle"
>
  {part.name}
</Text>

              </group>
            ))}
    
            {/* Character Model */}
            {model && (
              <primitive
                object={model}
                scale={[0.06, 0.06, 0.06]}
                position={[0, -3.5, -.05]}
              />
            )}
            
          </Canvas>
         
        </div>
        <div className="game-setting-controls">
            
            <div className="adjust-div"> 
                    <h3 className="setting-headings">Adjust points</h3>

                <div className="select-points">
                    
      {defaultPoints.map((point, index) => (
        <button onClick={()=>setSelectedPoint(index+1)} style={selectedPoint==index+1?{backgroundColor:'var(--secondary-color)'}:{backgroundColor:'white'}} key={index}>
          Point {point.name}
        </button>
      ))}
      <button onClick={()=>setCoordinates(defaultPoints)} style={{backgroundColor:'rgb(236, 108, 108)',fontWeight:"800"}}>Reset</button>
    </div>
                <Box sx={{ width: 400, p: 1, border: '1px solid #ccc', borderRadius: 2 }}>
    
    
          <Stack spacing={1}>
            <Box sx={{display:'flex',flexDirection:'column'}}>
              <Typography variant="body2" sx={{fontSize:'12px'}}>X Axis</Typography>
              <Slider
                defaultValue={coordinates[selectedPoint-1].position[0]}
                min={-3}
                max={3}
                step={0.0001}
                valueLabelDisplay="auto"
                sx={{ width: 370 }} 
                onChange={(e, newValue) => {
  const updated = [...coordinates];
  updated[selectedPoint - 1].position[0] = newValue;
  setCoordinates(updated);

  const key = `x${selectedPoint - 1}`;
  setAllSetting(prev => ({ ...prev, [key]: newValue }));
}}



              />
            </Box>
    
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  <Typography variant="body2">Y Axis</Typography>
  <Slider
    value={coordinates[selectedPoint - 1].position[1]}
    min={-3}
    max={3}
    step={0.0001}
    valueLabelDisplay="auto"
    sx={{ width: 370 }}
    onChange={(e, newValue) => {
  const updated = [...coordinates];
  updated[selectedPoint - 1].position[1] = newValue;
  setCoordinates(updated);

  const key = `y${selectedPoint - 1}`;
  setAllSetting(prev => ({ ...prev, [key]: newValue }));
}}

  />
</Box>

<Box sx={{ display: 'flex', flexDirection: 'column' }}>
  <Typography variant="body2">Z Axis</Typography>
  <Slider
    value={coordinates[selectedPoint - 1].position[2]}
    min={-3}
    max={3}
    step={0.0001}
    valueLabelDisplay="auto"
    sx={{ width: 370 }}
   onChange={(e, newValue) => {
  const updated = [...coordinates];
  updated[selectedPoint - 1].position[2] = newValue;
  setCoordinates(updated);

  const key = `z${selectedPoint - 1}`;
  setAllSetting(prev => ({ ...prev, [key]: newValue }));
}}


  />
</Box>
<div className="setting-btn">
  <button className="apply-btn" onClick={applyPositions}>Apply positions</button>
  <button className="apply-btn previous" onClick={loadPreviousSpawnPointList}>Load previous positions</button>
  
</div>

          </Stack>
        </Box>
            </div>
            <div className="adjust-div hand-sel">
                <div className="set-hand">
                  <h3 className="setting-headings">Select Hand</h3>
                  <div><button style={allSetting.handSelected=="Right"?{backgroundColor:'var(--primary-color)',color:'white'}:{backgroundColor:''}}
    onClick={() =>
      setAllSetting((prev) => ({ ...prev, handSelected: "Right" }))
    }
  >
    Right
  </button>
  
  <button style={allSetting.handSelected=="Left"?{backgroundColor:'var(--primary-color)',color:'white'}:{backgroundColor:''}}
    onClick={() =>
      setAllSetting((prev) => ({ ...prev, handSelected: "Left" }))
    }
  >
    Left
  </button>
                  </div>

                  {/* MR Toggle*/}
                  
                </div>

                <div className="set-hand">
                  <h3 className="setting-headings">Select View</h3>
                    <div><button style={allSetting.ToggleMR==false?{backgroundColor:'var(--primary-color)',color:'white'}:{backgroundColor:''}}
      onClick={() =>
        setAllSetting((prev) => ({ ...prev, ToggleMR: false }))
      }
    >
      VR
    </button>
    
    <button style={allSetting.ToggleMR==true?{backgroundColor:'var(--primary-color)',color:'white'}:{backgroundColor:''}}
      onClick={() =>
        setAllSetting((prev) => ({ ...prev, ToggleMR: true }))
      }
    >
      MR
    </button>
                    </div>
                </div>

            </div>
            <div className="adjust-div">

  <div style={{display:'flex'}}>
    <TextField sx={{margin:'15px',width:'140px'}}
      label="Total Repetitions"
      type="number"
      size="small"
      value={allSetting.totalRepCount}
      onChange={(e) =>
        setAllSetting((prev) => ({
          ...prev,
          totalRepCount: Number(e.target.value),
        }))
      }
    />
    <TextField sx={{margin:'15px',width:'140px'}}
      label="Spawn Gap in seconds"
      type="number"
      size="small"
      value={allSetting.spawningGap}
      onChange={(e) =>
        setAllSetting((prev) => ({
          ...prev,
          spawningGap: Number(e.target.value),
        }))
      }
    />
  </div>
</div>
<div className="setting-apply-btns">
  <Stack direction="row" spacing={2}>
    <Button variant="outlined" onClick={()=>setOpenSettings(false)}>
      Close
    </Button>
    <Button variant="contained" sx={{backgroundColor:'var(--primary-color)'}} onClick={applySetting} >
      Apply Settings
    </Button>
  </Stack>
</div>
        </div>
    </div>
  );
};

export default GameSetting;


const AnimatedSphere = ({ efficiency }) => {
  const ref = useRef();

  // useFrame(({ clock }) => {
  //   const scale = 0.12 + Math.sin(clock.getElapsedTime() * 7) * 1;
  //   if (ref.current) {
  //     ref.current.scale.set(scale, scale, scale);
  //   }
  // });

  const colorHue = (efficiency / 100) * 120; // 0 (red) → 120 (green)

  return (
    <mesh ref={ref}>
<sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={`rgb(0, 255, 76)`}
        // emissive={`hsl(${colorHue}, 100%, 40%)`}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
};  