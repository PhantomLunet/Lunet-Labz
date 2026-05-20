import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const GHOST_TEXTURE =
  "https://static.prod-images.emergentagent.com/jobs/cf313e6c-1ef6-480f-8538-031db3fc25ba/images/7c5b31871d6467e38ff062ebd5f5f5ed2acc32acd94f16699c3b8feb62fd6dda.png";

function GhostMesh({ mouse }) {
  const group = useRef();
  const inner = useRef();
  const texture = useLoader(THREE.TextureLoader, GHOST_TEXTURE);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.9) * 0.18;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        (mouse.current.x - 0.5) * 0.4,
        0.04
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        (mouse.current.y - 0.5) * 0.2,
        0.04
      );
    }
    if (inner.current) {
      inner.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={inner}>
        <planeGeometry args={[4.2, 4.2, 1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Sparkles({ count = 70 }) {
  const points = useRef();
  // Build geometry imperatively to avoid R3F prop conflicts
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.05,
        color: new THREE.Color("#c27b66"),
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((state) => {
    if (points.current) {
      const t = state.clock.getElapsedTime();
      points.current.rotation.y = t * 0.02;
      points.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

function SoftHalo() {
  const mesh = useRef();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color("#a3b19b") },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec3 uColor;
          void main(){
            float d = distance(vUv, vec2(0.5));
            float a = smoothstep(0.5, 0.0, d) * 0.35;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    []
  );
  const geo = useMemo(() => new THREE.PlaneGeometry(7, 7, 1, 1), []);

  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.getElapsedTime();
      mesh.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.04);
    }
  });

  return (
    <mesh
      ref={mesh}
      geometry={geo}
      material={material}
      position={[0, 0, -1.5]}
    />
  );
}

export default function Ghost3D({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} />
      <Suspense fallback={null}>
        <SoftHalo />
        <GhostMesh mouse={mouse} />
        <Sparkles count={70} />
      </Suspense>
    </Canvas>
  );
}
