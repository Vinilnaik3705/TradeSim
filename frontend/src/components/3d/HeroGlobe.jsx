import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

export default function HeroGlobe() {
    const sphereRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.y = time * 0.2;
            sphereRef.current.rotation.z = time * 0.1;
        }
    });

    return (
        <group>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.4}>
                <MeshDistortMaterial
                    color="#38BDF8"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe
                />
            </Sphere>
            <Sphere args={[1.5, 32, 32]} scale={2}>
                <meshStandardMaterial color="#22C55E" wireframe transparent opacity={0.1} />
            </Sphere>
        </group>
    );
}
