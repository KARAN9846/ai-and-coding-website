"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./hero-visual.module.css";

const BLUE = "#4f8cff";
const CYAN = "#62e8ff";
const ICE = "#d8f4ff";
const DEEP = "#071228";
const VIOLET = "#8ca2ff";

const palettes = {
  dark: {
    blue: BLUE,
    cyan: CYAN,
    ice: ICE,
    deep: DEEP,
    violet: VIOLET,
    panel: "#071228",
    panelTop: "#123064",
    core: "#9edcff",
    coreEmissive: "#1c68ff",
    keyLight: "#eff8ff",
  },
  light: {
    blue: "#245bdb",
    cyan: "#00a9c7",
    ice: "#f8fdff",
    deep: "#dfeaff",
    violet: "#5c70d6",
    panel: "#f4f8ff",
    panelTop: "#d8e7ff",
    core: "#7bbcff",
    coreEmissive: "#1e64e6",
    keyLight: "#ffffff",
  },
};

type PointTuple = [number, number, number];
type VisualPalette = (typeof palettes)["dark"];

function NeuralNode({
  position,
  size = 0.07,
  color = CYAN,
}: {
  position: PointTuple;
  size?: number;
  color?: string;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 20, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.75}
        roughness={0.28}
      />
    </mesh>
  );
}

function ConnectionLines({
  points,
  color,
}: {
  points: PointTuple[];
  color: string;
}) {
  const geometry = useMemo(() => {
    const links: PointTuple[] = [
      points[0],
      points[1],
      points[1],
      points[2],
      points[2],
      points[3],
      points[3],
      points[4],
      points[4],
      points[5],
      points[5],
      points[0],
      points[0],
      points[3],
      points[1],
      points[4],
      points[2],
      points[5],
    ];

    const positions = new Float32Array(links.flat());
    const lineGeometry = new THREE.BufferGeometry();

    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    return lineGeometry;
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.44} />
    </lineSegments>
  );
}

function CircuitPanel({
  position,
  rotation,
  scale,
  accent = CYAN,
  compact,
  palette,
}: {
  position: PointTuple;
  rotation: PointTuple;
  scale: PointTuple;
  accent?: string;
  compact: boolean;
  palette: VisualPalette;
}) {
  const traces = compact ? 5 : 8;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <boxGeometry args={[1.42, 0.08, 0.92]} />
        <meshStandardMaterial
          color={palette.panel}
          emissive={palette.blue}
          emissiveIntensity={palette === palettes.dark ? 0.12 : 0.04}
          metalness={palette === palettes.dark ? 0.42 : 0.18}
          roughness={palette === palettes.dark ? 0.34 : 0.42}
        />
      </mesh>

      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[1.46, 0.018, 0.96]} />
        <meshStandardMaterial
          color={palette.panelTop}
          emissive={palette.blue}
          emissiveIntensity={palette === palettes.dark ? 0.16 : 0.06}
          transparent
          opacity={palette === palettes.dark ? 0.72 : 0.86}
          metalness={palette === palettes.dark ? 0.18 : 0.12}
          roughness={0.24}
        />
      </mesh>

      {Array.from({ length: traces }).map((_, index) => {
        const width = 0.28 + (index % 3) * 0.17;
        const z = -0.32 + index * (0.64 / Math.max(traces - 1, 1));
        const x = index % 2 === 0 ? -0.34 : 0.22;

        return (
          <mesh
            key={index}
            position={[x, 0.066, z]}
            rotation={[0, index % 2 === 0 ? 0.08 : -0.06, 0]}
          >
            <boxGeometry args={[width, 0.014, 0.018]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={1.25}
              roughness={0.36}
            />
          </mesh>
        );
      })}

      {!compact &&
        [-0.46, 0.44].map((x) => (
          <mesh key={x} position={[x, 0.078, 0.31]}>
            <boxGeometry args={[0.17, 0.026, 0.13]} />
            <meshStandardMaterial
              color={palette.ice}
              emissive={palette.ice}
              emissiveIntensity={palette === palettes.dark ? 0.34 : 0.14}
              metalness={0.5}
              roughness={0.22}
            />
          </mesh>
        ))}
    </group>
  );
}

function OrbitRing({
  radius,
  tube,
  rotation,
  speed,
  color,
  nodeColor,
  nodeOffset = 0,
  reducedMotion,
}: {
  radius: number;
  tube: number;
  rotation: PointTuple;
  speed: number;
  color: string;
  nodeColor: string;
  nodeOffset?: number;
  reducedMotion: boolean;
}) {
  const ringRef = useRef<THREE.Group>(null);
  const nodeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (reducedMotion) {
      return;
    }

    const t = clock.getElapsedTime();

    if (ringRef.current) {
      ringRef.current.rotation.z = t * speed;
    }

    if (nodeRef.current) {
      const angle = t * speed * 1.85 + nodeOffset;

      nodeRef.current.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      );
    }
  });

  return (
    <group rotation={rotation}>
      <group ref={ringRef}>
        <mesh>
          <torusGeometry args={[radius, tube, 12, 160]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.72}
            transparent
            opacity={0.52}
            roughness={0.38}
          />
        </mesh>

        <mesh ref={nodeRef} position={[radius, 0, 0]}>
          <sphereGeometry args={[0.045, 18, 18]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={color}
            emissiveIntensity={2.4}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}

function DataConstellation({
  compact,
  color,
}: {
  compact: boolean;
  color: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = compact ? 34 : 64;

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / Math.max(count - 1, 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const shell = 2.34 + ((i % 5) - 2) * 0.035;

      values[i * 3] = Math.cos(theta) * radius * shell;
      values[i * 3 + 1] = y * shell * 0.72;
      values[i * 3 + 2] = Math.sin(theta) * radius * shell * 0.76;
    }

    return values;
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.025;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.18) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={compact ? 0.03 : 0.034}
        transparent
        opacity={0.66}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function LearningEngine({
  compact,
  reducedMotion,
  palette,
}: {
  compact: boolean;
  reducedMotion: boolean;
  palette: VisualPalette;
}) {
  const engineRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const nodes = useMemo<PointTuple[]>(
    () => [
      [-0.72, 0.42, 0.38],
      [-0.42, -0.58, 0.5],
      [0.52, -0.46, 0.42],
      [0.78, 0.28, 0.34],
      [0.1, 0.78, 0.48],
      [-0.02, -0.02, 0.82],
    ],
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (engineRef.current && !reducedMotion) {
      engineRef.current.position.y = Math.sin(t * 0.72) * 0.08;
      engineRef.current.rotation.y = Math.sin(t * 0.26) * 0.12;
      engineRef.current.rotation.z = Math.sin(t * 0.18) * 0.035;
    }

    if (coreRef.current && !reducedMotion) {
      const pulse = 1 + Math.sin(t * 1.55) * 0.045;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={engineRef} scale={compact ? 0.9 : 1.08}>
      <CircuitPanel
        compact={compact}
        position={[-0.68, -0.36, -0.28]}
        rotation={[0.18, -0.4, 0.18]}
        scale={[1.05, 1, 1]}
        accent={palette.blue}
        palette={palette}
      />

      <CircuitPanel
        compact={compact}
        position={[0.56, 0.42, -0.22]}
        rotation={[-0.16, 0.35, -0.24]}
        scale={[0.92, 1, 0.84]}
        accent={palette.cyan}
        palette={palette}
      />

      {!compact && (
        <CircuitPanel
          compact={compact}
          position={[0.1, -0.9, -0.12]}
          rotation={[0.34, 0.1, -0.08]}
          scale={[0.82, 1, 0.7]}
          accent={palette.violet}
          palette={palette}
        />
      )}

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.86, 2]} />
        <meshPhysicalMaterial
          color={palette.core}
          emissive={palette.coreEmissive}
          emissiveIntensity={palette === palettes.dark ? 0.3 : 0.12}
          metalness={palette === palettes.dark ? 0.2 : 0.12}
          roughness={palette === palettes.dark ? 0.18 : 0.26}
          clearcoat={0.85}
          clearcoatRoughness={0.16}
          transparent
          opacity={palette === palettes.dark ? 0.84 : 0.92}
        />
      </mesh>

      <mesh scale={1.025}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial
          color={palette.cyan}
          wireframe
          transparent
          opacity={palette === palettes.dark ? 0.28 : 0.36}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial
          color={palette.ice}
          emissive={palette.cyan}
          emissiveIntensity={palette === palettes.dark ? 2.9 : 1.35}
          roughness={0.18}
        />
      </mesh>

      <pointLight
        color={palette.cyan}
        intensity={compact ? 2.4 : 3.2}
        distance={4.2}
      />

      <ConnectionLines points={nodes} color={palette.cyan} />

      {nodes.map((position, index) => (
        <NeuralNode
          key={position.join("-")}
          position={position}
          size={index === 5 ? 0.085 : 0.062}
          color={index % 2 === 0 ? palette.cyan : palette.blue}
        />
      ))}
    </group>
  );
}

function Scene({
  reducedMotion,
  compact,
  palette,
}: {
  reducedMotion: boolean;
  compact: boolean;
  palette: VisualPalette;
}) {
  const sceneGroup = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ pointer, clock }) => {
    if (!sceneGroup.current) {
      return;
    }

    if (!reducedMotion) {
      target.current.x += (pointer.x - target.current.x) * 0.045;
      target.current.y += (pointer.y - target.current.y) * 0.045;
    }

    const t = clock.getElapsedTime();

    sceneGroup.current.rotation.y = target.current.x * 0.24;
    sceneGroup.current.rotation.x = -target.current.y * 0.15;
    sceneGroup.current.position.x = target.current.x * 0.12;
    sceneGroup.current.position.y = target.current.y * 0.08 + Math.sin(t * 0.42) * 0.035;
  });

  return (
    <>
      <ambientLight intensity={palette === palettes.dark ? 0.66 : 0.82} />
      <directionalLight
        position={[4.5, 5.2, 5.4]}
        intensity={palette === palettes.dark ? 2.2 : 2.45}
        color={palette.keyLight}
      />
      <pointLight position={[-3.4, 1.7, 3.2]} intensity={2.15} color={palette.blue} />
      <pointLight position={[2.6, -2.8, 2.4]} intensity={1.7} color={palette.cyan} />
      <spotLight
        position={[0, 3.8, 4.8]}
        angle={0.58}
        penumbra={0.72}
        intensity={1.15}
        color={palette.keyLight}
      />

      <group ref={sceneGroup} position={[0.1, 0, 0]}>
        <LearningEngine
          compact={compact}
          reducedMotion={reducedMotion}
          palette={palette}
        />

        <OrbitRing
          radius={1.92}
          tube={0.01}
          rotation={[1.16, 0.18, 0.3]}
          speed={0.12}
          color={palette.cyan}
          nodeColor={palette.ice}
          reducedMotion={reducedMotion}
        />
        <OrbitRing
          radius={2.23}
          tube={0.008}
          rotation={[0.45, -0.36, -0.62]}
          speed={-0.08}
          color={palette.blue}
          nodeColor={palette.ice}
          nodeOffset={1.7}
          reducedMotion={reducedMotion}
        />
        {!compact && (
          <OrbitRing
            radius={1.58}
            tube={0.007}
            rotation={[-0.82, 0.42, 1.08]}
            speed={0.095}
            color={palette.violet}
            nodeColor={palette.ice}
            nodeOffset={3.1}
            reducedMotion={reducedMotion}
          />
        )}

        <DataConstellation compact={compact} color={palette.ice} />
      </group>
    </>
  );
}

export function HeroVisual() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const palette = isLightTheme ? palettes.light : palettes.dark;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMotion = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    const checkCompact = () => {
      setCompact(window.innerWidth < 700);
    };

    const checkTheme = () => {
      setIsLightTheme(document.documentElement.dataset.theme === "light");
    };

    motionQuery.addEventListener("change", handleMotion);
    window.addEventListener("resize", checkCompact);
    const themeObserver = new MutationObserver(checkTheme);

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const frame = window.requestAnimationFrame(() => {
      setReducedMotion(motionQuery.matches);
      checkCompact();
      checkTheme();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotion);
      window.removeEventListener("resize", checkCompact);
    };
  }, []);

  return (
    <div className={styles.visual}>
      <div className={styles.glow} />

      <div className={styles.visual3d}>
        <div className={`${styles.cssRing} ${styles.cssRingOne}`} />
        <div className={`${styles.cssRing} ${styles.cssRingTwo}`} />
        <div className={`${styles.cssRing} ${styles.cssRingThree}`} />

        <div className={styles.cssEngine}>
          <div className={`${styles.cssPanel} ${styles.cssPanelOne}`}>
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className={`${styles.cssPanel} ${styles.cssPanelTwo}`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className={`${styles.cssPanel} ${styles.cssPanelThree}`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className={styles.cssCore}>
            <span className={styles.cssCoreInner} />
            <span className={`${styles.cssNode} ${styles.cssNodeOne}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeTwo}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeThree}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeFour}`} />
            <span className={`${styles.cssNode} ${styles.cssNodeFive}`} />
          </div>
        </div>
      </div>

      <Canvas
        camera={{
          position: [0, 0.06, compact ? 5.9 : 5.35],
          fov: compact ? 42 : 36,
        }}
        dpr={compact ? [1, 1.2] : [1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene
          reducedMotion={reducedMotion}
          compact={compact}
          palette={palette}
        />
      </Canvas>

      <div className={`${styles.dataCard} ${styles.dataCardTop}`}>
        <span className={styles.dataDot} />
        <span>AI SYSTEM</span>
      </div>

      <div className={`${styles.dataCard} ${styles.dataCardBottom}`}>
        <span>LEARNING</span>
        <span className={styles.dataValue}>∞</span>
      </div>

      <div className={styles.cornerTopLeft} />
      <div className={styles.cornerBottomRight} />
    </div>
  );
}
