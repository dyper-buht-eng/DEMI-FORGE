import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  modelType?: 'axe' | 'gargoyle' | 'chest' | 'paladin' | 'portal' | 'tower' | 'default';
  wireframe?: boolean;
  spinning?: boolean;
  color?: string;
  className?: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  modelType = 'axe',
  wireframe = false,
  spinning = true,
  color,
  className = 'w-full h-full min-h-[300px]',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const meshGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 300;
    const height = currentMount.clientHeight || 300;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 4.8);
    camera.lookAt(0, 0.4, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const warmLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    warmLight.position.set(4, 8, 5);
    warmLight.castShadow = true;
    scene.add(warmLight);

    const coolRimLight = new THREE.PointLight(0x3b82f6, 3, 20);
    coolRimLight.position.set(-4, 3, -3);
    scene.add(coolRimLight);

    // 5. Build 3D Miniature Model Group
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // Pedestal base (like physical tabletop miniature)
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.25, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      roughness: 0.8,
      metalness: 0.2,
      wireframe,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.125;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Gold trim ring on pedestal
    const ringGeo = new THREE.TorusGeometry(1.25, 0.04, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.3,
      wireframe,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.05;
    group.add(ringMesh);

    // Artifact Miniature Figure
    const mainColor = color ? parseInt(color.replace('#', '0x')) : 0xf59e0b;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      metalness: 0.65,
      roughness: 0.35,
      wireframe,
    });

    if (modelType === 'axe') {
      // The Rune Axe: handle cylinder + dual axe head blades
      const handleGeo = new THREE.CylinderGeometry(0.08, 0.1, 2.2, 16);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.8, wireframe });
      const handleMesh = new THREE.Mesh(handleGeo, handleMat);
      handleMesh.position.y = 1.0;
      group.add(handleMesh);

      // Blades
      const bladeGeo = new THREE.BoxGeometry(1.1, 0.8, 0.15);
      const bladeMesh = new THREE.Mesh(bladeGeo, bodyMat);
      bladeMesh.position.set(0.4, 1.6, 0);
      bladeMesh.rotation.z = 0.2;
      group.add(bladeMesh);

      const bladeGeo2 = new THREE.BoxGeometry(1.1, 0.8, 0.15);
      const bladeMesh2 = new THREE.Mesh(bladeGeo2, bodyMat);
      bladeMesh2.position.set(-0.4, 1.6, 0);
      bladeMesh2.rotation.z = -0.2;
      group.add(bladeMesh2);

      // Glowing rune orb center
      const orbGeo = new THREE.DodecahedronGeometry(0.25);
      const orbMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, roughness: 0.2 });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      orbMesh.position.set(0, 1.6, 0);
      group.add(orbMesh);
    } else if (modelType === 'chest') {
      // Mimic Chest
      const boxGeo = new THREE.BoxGeometry(1.2, 0.7, 0.9);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6, wireframe });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.y = 0.45;
      group.add(box);

      // Lid tilted open
      const lidGeo = new THREE.BoxGeometry(1.25, 0.3, 0.95);
      const lid = new THREE.Mesh(lidGeo, bodyMat);
      lid.position.set(0, 0.95, -0.1);
      lid.rotation.x = -0.3;
      group.add(lid);

      // Sharp Teeth inside
      const teethGeo = new THREE.ConeGeometry(0.08, 0.25, 8);
      const teethMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      for (let i = -4; i <= 4; i++) {
        const t = new THREE.Mesh(teethGeo, teethMat);
        t.position.set(i * 0.12, 0.8, 0.35);
        t.rotation.x = Math.PI;
        group.add(t);
      }
    } else if (modelType === 'portal') {
      // Void Portal
      const torusGeo = new THREE.TorusGeometry(0.9, 0.15, 16, 64);
      const torus = new THREE.Mesh(torusGeo, bodyMat);
      torus.position.y = 1.1;
      group.add(torus);

      const vortexGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.05, 32);
      const vortexMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x6d28d9,
        wireframe,
      });
      const vortex = new THREE.Mesh(vortexGeo, vortexMat);
      vortex.rotation.x = Math.PI / 2;
      vortex.position.y = 1.1;
      group.add(vortex);
    } else {
      // Default: Knight Miniature (Paladin / Sentry)
      const bodyGeo = new THREE.CylinderGeometry(0.3, 0.45, 1.1, 16);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.75;
      group.add(body);

      // Helm
      const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.position.y = 1.5;
      group.add(head);

      // Shield
      const shieldGeo = new THREE.BoxGeometry(0.6, 0.9, 0.1);
      const shieldMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.8, roughness: 0.3, wireframe });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.position.set(-0.55, 0.9, 0.2);
      shield.rotation.y = 0.3;
      group.add(shield);

      // Sword
      const bladeGeo = new THREE.BoxGeometry(0.1, 1.4, 0.04);
      const blade = new THREE.Mesh(bladeGeo, bodyMat);
      blade.position.set(0.6, 1.0, 0.2);
      group.add(blade);
    }

    // Animation loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (spinning && !isDraggingRef.current && meshGroupRef.current) {
        meshGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse interactive rotate
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      meshGroupRef.current.rotation.y += deltaX * 0.01;
      meshGroupRef.current.rotation.x += deltaY * 0.005;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize observer
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType, wireframe, spinning, color]);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to rotate 3D miniature"
    />
  );
};
