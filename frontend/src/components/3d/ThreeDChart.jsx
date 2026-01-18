import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';

const Bar = ({ position, height, color, speed }) => {
    const ref = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Animate height or scale slightly
        ref.current.scale.y = 1 + Math.sin(time * speed) * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <RoundedBox ref={ref} args={[0.8, height, 0.8]} radius={0.1} smoothness={4} position={position}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
            </RoundedBox>
        </Float>
    );
};

export default function ThreeDChart() {
    return (
        <group rotation={[0, -Math.PI / 6, 0]} position={[1, -1, 0]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} color="blue" intensity={0.5} />

            {/* Abstract Chart Bars */}
            <Bar position={[-3, 2, 0]} height={4} color="#38BDF8" speed={1} />
            <Bar position={[-1.5, 3.5, 0]} height={7} color="#0FA5E9" speed={1.5} />
            <Bar position={[0, 1.5, 0]} height={3} color="#6366F1" speed={0.8} />
            <Bar position={[1.5, 5, 0]} height={10} color="#818CF8" speed={1.2} />
            <Bar position={[3, 4, 0]} height={8} color="#A78BFA" speed={1.1} />

            {/* Base Grid or Platform (Optional, keeping it clean for now) */}
        </group>
    );
}
