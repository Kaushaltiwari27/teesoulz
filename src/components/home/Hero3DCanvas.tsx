'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // Renderer with transparency & antialias
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects for mouse rotation
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Chrome Streetwear Emblem (Torus Knot Sculpture)
    const knotGeometry = new THREE.TorusKnotGeometry(1.3, 0.38, 128, 32, 2, 3);
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.96,
      roughness: 0.12,
      wireframe: false,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, chromeMaterial);
    knotMesh.position.set(2.2, 0.2, 0);
    worldGroup.add(knotMesh);

    // 2. Secondary Floating Chrome Ring
    const ringGeometry = new THREE.TorusGeometry(2.1, 0.08, 24, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d4,
      metalness: 0.98,
      roughness: 0.08,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.position.set(2.2, 0.2, 0);
    ringMesh.rotation.x = Math.PI / 3;
    worldGroup.add(ringMesh);

    // 3. Floating 3D Geometric Streetwear Prisms (Floating Elements)
    const floatingPrisms: THREE.Mesh[] = [];
    const prismGeo = new THREE.OctahedronGeometry(0.35, 0);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: false,
    });

    const positions = [
      [-3.2, 2.0, -1],
      [-2.8, -2.2, 1],
      [4.2, 2.5, -2],
      [3.8, -2.4, 0.5],
      [-4.0, 0.2, -0.5],
    ];

    positions.forEach((pos, idx) => {
      const prism = new THREE.Mesh(prismGeo, prismMat.clone());
      prism.position.set(pos[0], pos[1], pos[2]);
      prism.scale.setScalar(0.7 + (idx % 3) * 0.3);
      worldGroup.add(prism);
      floatingPrisms.push(prism);
    });

    // 4. Ambient 3D Particle Cloud (Light Embers / Floating Micro-Dust)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 16;
      particlePos[i + 1] = (Math.random() - 0.5) * 12;
      particlePos[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particleSystem);

    // 5. Blender 3D Viewport Horizon Grid (Subtle futuristic floor)
    const gridHelper = new THREE.GridHelper(24, 24, 0x555555, 0x222222);
    gridHelper.position.set(0, -3.2, 0);
    gridHelper.rotation.x = 0.05;
    worldGroup.add(gridHelper);

    // Lighting setup (Blender Studio Lighting)
    // Studio Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key Light (Bright white from upper front)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    // Rim/Back Light (Cool silver backlight from behind)
    const rimLight = new THREE.DirectionalLight(0xa0a0a0, 3.0);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // Interactive Point Light (Follows mouse cursor)
    const cursorLight = new THREE.PointLight(0xffffff, 4.0, 12);
    cursorLight.position.set(0, 0, 3);
    scene.add(cursorLight);

    // Mouse coordinates tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x;
      targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Adjust positions for mobile vs desktop
      if (width < 768) {
        knotMesh.position.set(0, -0.6, -1);
        ringMesh.position.set(0, -0.6, -1);
        knotMesh.scale.setScalar(0.75);
        ringMesh.scale.setScalar(0.75);
      } else {
        knotMesh.position.set(2.4, 0.1, 0);
        ringMesh.position.set(2.4, 0.1, 0);
        knotMesh.scale.setScalar(1);
        ringMesh.scale.setScalar(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp for mouse coordinates
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Update cursor light position
      cursorLight.position.x = currentX * 5;
      cursorLight.position.y = currentY * 3.5;

      // Rotate Chrome Knot
      knotMesh.rotation.x = elapsedTime * 0.35 + currentY * 0.5;
      knotMesh.rotation.y = elapsedTime * 0.45 + currentX * 0.5;

      // Rotate Secondary Ring
      ringMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.2;
      ringMesh.rotation.y = -elapsedTime * 0.25;
      ringMesh.rotation.z = elapsedTime * 0.15;

      // Animate floating prisms
      floatingPrisms.forEach((prism, idx) => {
        prism.rotation.x += 0.01 * (idx + 1);
        prism.rotation.y += 0.015 * (idx + 1);
        prism.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.003;
      });

      // Animate particle dust drift
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Subtle scene camera parallax
      worldGroup.rotation.y = currentX * 0.2;
      worldGroup.rotation.x = -currentY * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose Three.js resources
      knotGeometry.dispose();
      chromeMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2] overflow-hidden"
      aria-hidden="true"
    />
  );
}
