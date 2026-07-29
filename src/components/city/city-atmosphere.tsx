"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { CityVisitMode } from "@/lib/city-assets";

function Particles({ mode }: { mode: CityVisitMode }) {
  const points = useRef<THREE.Points>(null);
  const count = mode === "returning" ? 48 : 64;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 8 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    if (delta > 0.05) return;
    points.current.rotation.y += delta * 0.015;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
  });

  const color = mode === "returning" ? "#34d399" : "#94a3b8";

  return (
    <points ref={points} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/** Soft idle invalidate so demand-frameloop still animates lightly. */
function IdleInvalidate() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      if (frame % 2 === 0) invalidate();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);

  return null;
}

function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return true;
  if (
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g"
  ) {
    return true;
  }
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return true;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches
  ) {
    return true;
  }
  return false;
}

type CityAtmosphereProps = {
  mode: CityVisitMode;
};

/**
 * Lightweight R3F overlay — particles + fog for depth.
 * Demand frameloop to avoid fighting video decode during scroll scrub.
 */
export function CityAtmosphere({ mode }: CityAtmosphereProps) {
  if (isLowPowerDevice()) return null;

  return (
    <Canvas
      className="!absolute inset-0 h-full w-full"
      dpr={1}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 1.2, 6], fov: 45 }}
      frameloop="demand"
      style={{ pointerEvents: "none" }}
    >
      <IdleInvalidate />
      <fog attach="fog" args={["#020617", 6, 16]} />
      <ambientLight intensity={0.35} />
      <Particles mode={mode} />
    </Canvas>
  );
}
