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
        const graphMaterial = new THREE.LineBasicMaterial({ color: 0xff0644 });
        const graph = new THREE.Line(graphGeometry, graphMaterial);
        scene.add(graph);

        camera.position.z = 17;

        const animate = (time) => {
            requestAnimationFrame(animate);
        
            const currentTime = time / 300000;
            gridMaterial.uniforms.time.value = currentTime;
        
            const positions = [];
            for (let i = 0; i < 100; i++) {
                const x = i * 0.1 - 5; // Reverse the direction of the graph
                const y = (Math.sin((i * 0.04 + currentTime) * 2 * Math.PI) )* 2.3; // Adjust the amplitude of the sine wave to bring it closer to the grid floor
                const z = 6.5; // Position the graph closer to the screen
                positions.push(new THREE.Vector3(x, y, z));
            }
        
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
