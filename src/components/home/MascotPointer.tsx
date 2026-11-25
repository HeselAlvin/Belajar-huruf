import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import type { MenuTarget } from '../../types/app';

interface MascotPointerProps {
  target: MenuTarget | null;
  phase: 'idle' | 'moving' | 'tapping';
}

const MODEL_PATH = '/assets/mascot/karakter_maskot_3d.glb';

const BASE_ROTATION_Y = 0;

function MascotModel({ target, phase }: MascotPointerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  const normalizedScene = useMemo(() => {
    const cloned = scene.clone();
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.5 / maxDim;

    cloned.scale.setScalar(scale);
    cloned.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );
    return cloned;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const smooth = 1 - Math.exp(-8 * Math.min(delta, 0.1));
    const isLeft = target === 'alphabet';

    let targetRotY = BASE_ROTATION_Y + Math.sin(t * 1.4) * 0.14;
    let targetRotZ = 0;
    let targetPosY = Math.sin(t * 2.4) * 0.1;

    if (phase === 'moving' && target) {
      targetRotY = BASE_ROTATION_Y + (isLeft ? -0.65 : 0.65);
      targetRotZ = isLeft ? 0.1 : -0.1;
      targetPosY = 0.16;
    } else if (phase === 'tapping' && target) {
      targetRotY = BASE_ROTATION_Y + (isLeft ? -0.8 : 0.8);
      targetRotZ = isLeft ? 0.28 : -0.28;
      targetPosY = -0.05;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      smooth
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      smooth
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosY,
      smooth
    );
  });

  return (
    <group ref={groupRef}>
      <primitive object={normalizedScene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export function MascotPointer({ target, phase }: MascotPointerProps) {
  const isLeft = target === 'alphabet';
  const moveX = phase === 'idle' || !target ? 0 : isLeft ? -90 : 90;

  return (
    <motion.div
      className="pointer-events-none relative z-20 flex flex-col items-center justify-center"
      animate={{ x: moveX }}
      transition={{
        type: 'spring',
        stiffness: phase === 'tapping' ? 380 : 200,
        damping: phase === 'tapping' ? 16 : 20,
      }}
    >
      {/* Balon ucapan kecil saat idle */}
      <motion.div
        animate={{
          opacity: phase === 'idle' ? 1 : 0,
          y: phase === 'idle' ? 0 : -8,
          scale: phase === 'idle' ? 1 : 0.85,
        }}
        className="mb-1 rounded-2xl border-[3px] border-[#3D2314] bg-white px-4 py-1.5 text-sm font-extrabold text-[#3D2314] shadow-[0_4px_0_#3D2314]"
      >
        Mau Belajar Apa nih?
      </motion.div>

      {/* Panggung 3D Transparan */}
      <div className="h-56 w-56 sm:h-64 sm:w-64">
        <Canvas
          camera={{ position: [0, 0.2, 4.4], fov: 38 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          {/* Pencahayaan cerah ramah anak (tidak butuh koneksi internet) */}
          <ambientLight intensity={1.1} />
          <hemisphereLight args={['#ffffff', '#bae6fd', 0.9]} />
          <directionalLight position={[4, 6, 5]} intensity={1.5} />
          <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#fff7ed" />

          <Suspense fallback={null}>
            <MascotModel target={target} phase={phase} />
            <ContactShadows
              position={[0, -1.35, 0]}
              opacity={0.32}
              scale={4.5}
              blur={2.2}
              far={3}
              color="#3D2314"
            />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}