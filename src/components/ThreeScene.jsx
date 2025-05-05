import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { db } from '../../firebaseConfig'; // adjust path as needed
import { doc, onSnapshot } from 'firebase/firestore';

const ThreeScene = () => {
    const cubeRef = useRef();
    const rendererRef = useRef();

    const [cubeData, setCubeData] = useState({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
    });

    // Listen to Firestore for real-time updates
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'mockData', '1'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.position && data.rotation) {
                    setCubeData({
                        position: data.position,
                        rotation: data.rotation,
                    });
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Setup Three.js scene
    useEffect(() => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cubeRef.current = cube;

        // Add a light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        // Optional: ambient light to soften shadows
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(ambientLight);


        const animate = () => {
            requestAnimationFrame(animate);

            if (cubeRef.current) {
                // Apply position
                cubeRef.current.position.set(
                    cubeData.position.x,
                    cubeData.position.y,
                    cubeData.position.z
                );

                // Apply quaternion rotation
                const q = cubeData.rotation;
                cubeRef.current.setRotationFromQuaternion(
                    new THREE.Quaternion(q.x, q.y, q.z, q.w)
                );
            }

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                if (rendererRef.current.domElement.parentNode) {
                    rendererRef.current.domElement.parentNode.removeChild(
                        rendererRef.current.domElement
                    );
                }
            }
        };
    }, [cubeData]); // Update animation on state change

    return <></>;
};

export default ThreeScene;
