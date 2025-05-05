// src/components/MockVRData.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebaseConfig'; // Import Firestore
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import ThreeScene from './ThreeScene';

const MockVRData = () => {
  const [vrData, setVrData] = useState(null);

  useEffect(() => {
    const mockDataRef = doc(firestore, 'mockData', '1'); // Firestore path for mock data

    // Simulate position and rotation every 100ms (10 times per second)
    // const intervalId = setInterval(() => {
    //   const time = Date.now() / 1000;

    //   const mockData = {
    //     position: {
    //       x: Math.sin(time) * 2,
    //       y: 1, // You can modify this value if you want some movement on the Y-axis
    //       z: Math.cos(time) * 2,
    //     },
    //     rotation: {
    //       x: 0,
    //       y: Math.sin(time),
    //       z: 0,
    //       w: 1,
    //     },
    //   };

    //   // Push mock data to Firestore
    //   setDoc(mockDataRef, mockData, { merge: true }); // merge to avoid overwriting
    // }, 100); // Real-time updates every 100ms

    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(mockDataRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setVrData(data);
        // Here, you can also trigger the 3D character update (e.g., if using Three.js or similar)
      }
    });

    // Cleanup the interval and listener when the component unmounts
    return () => {
    //   clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>Mock VR Data for Physiotherapy</h2>
      <p>Simulating VR movement data...</p>
      <p>
        {vrData
          ? `Position: X = ${vrData.position.x}, Y = ${vrData.position.y}, Z = ${vrData.position.z}`
          : 'Waiting for data...'}
      </p>
      <ThreeScene/>
    </div>
  );
};

export default MockVRData;
