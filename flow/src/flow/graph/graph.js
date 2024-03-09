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

    const gridGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    const gridMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 3; // Rotate the grid to be slightly off-angle
    scene.add(grid);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
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
