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
                float glow = 1.9; // Fixed glow intensity
                vec3 boxColor = vec3(0.0, 0.0, 0.0); // Black color for boxes
                vec3 lineColor = vec3(0.0, 1.0, 0.0); // Green color for grid lines
                vec3 finalColor = mix(lineColor, boxColor, grid); // Mix colors based on grid value
                gl_FragColor = vec4(finalColor * glow, 1.0); // Apply glow effect to the grid lines and boxes
            }
            
        `
        });
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2.5; // Rotate the grid to be slightly off-angle
        grid.position.y = -3.0; // Center the grid vertically
        scene.add(grid);

        // Create a line geometry for the graph
        const graphGeometry = new THREE.BufferGeometry();
        const graphMaterial = new THREE.LineBasicMaterial({ color: 0xff046, linewidth: 15, }); // Change color to red
        const graph = new THREE.Line(graphGeometry, graphMaterial);
        scene.add(graph);

        camera.position.z = 17;

        // Create an initial positions array with 100 points
        const positions = [];
        for (let i = 0; i < 100; i++) {
            const x = i * 0.1 - 5;
            const y = 0;
            const z = 6.5;
            positions.push(new THREE.Vector3(x, y, z));
        }
        graphGeometry.setFromPoints(positions);


        const animate = (time) => {
            requestAnimationFrame(animate);

            const currentTime = time / 1000;
            gridMaterial.uniforms.time.value = currentTime;

            // Calculate the new y-coordinate for the rightmost point
            const frequency1 = 0.02 + Math.sin(currentTime) * 0.005; // Adjust frequency based on current time
            const frequency2 = 0.05 + Math.sin(currentTime * 1.5) * 0.01; // Adjust frequency based on current time
            const amplitude1 = 1.5 + Math.sin(currentTime * 0.7) * 0.3; // Adjust amplitude based on current time
            const amplitude2 = 1 + Math.sin(currentTime * 0.9) * 0.2; // Adjust amplitude based on current time
            const newY = Math.sin((99 * frequency1 + currentTime) * 2 * Math.PI) * amplitude1 + Math.sin((99 * frequency2 + currentTime) * 2 * Math.PI) * amplitude2;

            // Update existing positions instead of creating a new array
            for (let i = 0; i < positions.length - 1; i++) {
                positions[i].y = positions[i + 1].y;
            }
            positions[positions.length - 1].y = newY;
            graphGeometry.setFromPoints(positions);


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
