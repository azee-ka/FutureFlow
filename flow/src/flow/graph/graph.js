import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const StockGraph = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000); // Set background color to black
        canvasRef.current.appendChild(renderer.domElement);

        const gridGeometry = new THREE.PlaneGeometry(15, 15, 15, 15); // Grid size
        const gridMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `  
        varying vec2 vUv;
        uniform float time;
        void main() {
            float speed = 0.01; // Speed of the movement
            float offset = vUv.y; // Use only y-coordinate for offset calculation
            float grid = smoothstep(0.05, 0.06, mod(offset * 10.0 + (time - time), 1.0)) * smoothstep(0.05, 0.06, mod(vUv.x * 10.0 + time, 1.0)); // Color for grid lines
            float glow = 1.1; // Fixed glow intensity
            gl_FragColor = vec4(vec3(1.0 - grid) * glow, 1.0); // Apply glow effect to the grid lines
        }
        `
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2.7; // Rotate the grid to be slightly off-angle
        grid.position.y = -3.0; // Center the grid vertically
        scene.add(grid);

        camera.position.z = 15;

        const animate = () => {
            requestAnimationFrame(animate);
            gridMaterial.uniforms.time.value -= 0.004; // Update the time uniform for animation
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.domElement.remove();
        };
    }, []);

    return <div ref={canvasRef} />;
};

export default StockGraph;
