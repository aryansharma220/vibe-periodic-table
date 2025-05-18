import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import * as THREE from "three";

const ElectronOrbit = ({
  radius,
  electronCount,
  orbitColor,
  electronColor,
  speed = 1,
  rotation = [0, 0, 0],
}) => {
  const orbitRef = useRef();
  const electrons = useRef([]);
  useEffect(() => {
    if (electronCount > 0 && electrons.current.length === 0) {
      for (let i = 0; i < electronCount; i++) {
        const angle = (i / electronCount) * Math.PI * 2;

        electrons.current.push({
          angle,
          offset: Math.random() * 0.2 - 0.1,
          speedFactor: 0.95 + Math.random() * 0.1, 
        });
      }
    }
  }, [electronCount]);
  useFrame((state) => {
    if (orbitRef.current && electrons.current.length > 0) {
      const time = state.clock.getElapsedTime();

      orbitRef.current.rotation.x = rotation[0] + Math.sin(time * 0.2) * 0.03;
      orbitRef.current.rotation.y = rotation[1] + Math.cos(time * 0.15) * 0.03;
      orbitRef.current.rotation.z = rotation[2] + Math.sin(time * 0.1) * 0.01;
      const baseRotationAmount = 0.005 * speed;

      electrons.current.forEach((electron, i) => {
        if (orbitRef.current.children[i + 1]) {
          electron.angle += baseRotationAmount * electron.speedFactor;

          const angularPosition = electron.angle + electron.offset;
          const x = radius * Math.cos(angularPosition);
          const z = radius * Math.sin(angularPosition);

          orbitRef.current.children[i + 1].position.x = x;
          orbitRef.current.children[i + 1].position.y = 0; 
          orbitRef.current.children[i + 1].position.z = z;

          const phaseOffset = (i / electrons.current.length) * Math.PI * 2;
          const scale = 1 + Math.sin(time * 2 + phaseOffset) * 0.1;
          orbitRef.current.children[i + 1].scale.set(scale, scale, scale);
        }
      });
    }
  });
  return (
    <group ref={orbitRef}>
      {/* Orbit ring - no rotation needed as parent group handles initial rotation */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial
          color={orbitColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Electrons */}
      {[...Array(electronCount)].map((_, i) => {
        const angle = (i / electronCount) * Math.PI * 2;
        const electronSize = Math.min(0.15, 0.25 - electronCount * 0.005);

        return (
          <mesh
            key={i}
            position={[radius * Math.cos(angle), 0, radius * Math.sin(angle)]}
          >
            <sphereGeometry args={[electronSize, 16, 16]} />
            <meshPhongMaterial
              color={electronColor}
              emissive={electronColor}
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Nucleus = ({ protonCount, neutronCount, elementColor }) => {
  const nucleusRef = useRef();
  const particleRefs = useRef([]);

  useFrame((state) => {
    if (nucleusRef.current) {
      const t = state.clock.getElapsedTime();
      nucleusRef.current.rotation.y = t * 0.1;
      nucleusRef.current.rotation.z = t * 0.05;
      const scale = 1 + Math.sin(t * 1.5) * 0.03;
      nucleusRef.current.scale.set(scale, scale, scale);
      particleRefs.current.forEach((ref, i) => {
        if (ref) {
          const offset = i * 100;
          const moveX = Math.sin(t * 2 + offset) * 0.0008;
          const moveY = Math.cos(t * 1.5 + offset * 0.7) * 0.0008;
          const moveZ = Math.sin(t * 1 + offset * 1.3) * 0.0008;
          const distFromCenter = Math.sqrt(
            ref.position.x * ref.position.x +
              ref.position.y * ref.position.y +
              ref.position.z * ref.position.z
          );

          const maxDist = nucleusSize * 0.7;

          if (distFromCenter < maxDist) {
            ref.position.x += moveX;
            ref.position.y += moveY;
            ref.position.z += moveZ;
          } else {
            ref.position.x -= ref.position.x * 0.001;
            ref.position.y -= ref.position.y * 0.001;
            ref.position.z -= ref.position.z * 0.001;
          }
        }
      });
    }
  });

  const protonColor = new THREE.Color(elementColor).offsetHSL(0, 0.1, 0.1);
  const neutronColor = new THREE.Color(elementColor).offsetHSL(0, -0.4, -0.2);
  const totalParticles = protonCount + neutronCount;
  const nucleusSize = Math.max(
    0.8,
    Math.min(1.5, Math.pow(totalParticles / 10, 1 / 3))
  );
  Nucleus.calculatedSize = nucleusSize;

  return (
    <group ref={nucleusRef}>
      {/* Base nucleus "glow" */}
      <mesh>
        <sphereGeometry args={[nucleusSize, 32, 32]} />
        <meshPhongMaterial
          color={elementColor}
          transparent
          opacity={0.4}
          emissive={elementColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner nucleus core */}
      <mesh>
        <sphereGeometry args={[nucleusSize * 0.85, 24, 24]} />
        <meshPhongMaterial
          color={elementColor}
          transparent
          opacity={0.7}
          emissive={elementColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Protons */}
      {[...Array(protonCount)].map((_, i) => {
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * Math.PI * 2;
        const r = nucleusSize * 0.7 * Math.cbrt(Math.random());
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        return (
          <mesh
            key={`p-${i}`}
            ref={(el) => (particleRefs.current[i] = el)}
            position={[x, y, z]}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhongMaterial
              color={protonColor}
              emissive={protonColor}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}

      {/* Neutrons */}
      {[...Array(neutronCount)].map((_, i) => {
        const theta = Math.acos(2 * (Math.random() * 0.99 + 0.01) - 1);
        const phi = (Math.random() * 0.95 + 0.05) * Math.PI * 2; 
        const r = nucleusSize * 0.7 * Math.cbrt(Math.random());
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        return (
          <mesh
            key={`n-${i}`}
            ref={(el) => (particleRefs.current[protonCount + i] = el)}
            position={[x, y, z]}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshPhongMaterial
              color={neutronColor}
              emissive={neutronColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Atom = ({ element, elementColor }) => {
  const electronCount = element.number;
  const protonCount = element.number;
  const neutronCount = Math.round(element.atomic_mass) - element.number;

  const nucleusScaleFactor = Math.pow(element.number / 10, 1 / 6);
  const getElectronShells = () => {
    const shells = [];
    let remainingElectrons = electronCount;
    const maxElectronsPerShell = [2, 8, 18, 32, 50, 72];

    for (
      let n = 0;
      n < maxElectronsPerShell.length && remainingElectrons > 0;
      n++
    ) {
      const shellElectrons = Math.min(
        maxElectronsPerShell[n],
        remainingElectrons
      );
      shells.push(shellElectrons);
      remainingElectrons -= shellElectrons;
    }
    if (remainingElectrons > 0) {
      shells[shells.length - 1] += remainingElectrons;
    }

    return shells;
  };

  const electronShells = getElectronShells();
  const generateOrbitRotations = (shellIndex, totalShells) => {
    if (totalShells === 1) {
      return [0, 0, 0];
    }

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const adjustedIndex = shellIndex + 1;
    const adjustedTotal = Math.max(4, totalShells);
    const y = 1 - (adjustedIndex / adjustedTotal) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = (2 * Math.PI * adjustedIndex) / goldenRatio;

    const x = Math.asin(y);
    const z = theta;

    return [x, 0, z];
  };

  return (
    <>
      {/* Point light at center */}
      <pointLight
        position={[0, 0, 0]}
        intensity={20}
        color={elementColor}
        distance={10}
      />

      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Nucleus */}
      <Nucleus
        protonCount={protonCount}
        neutronCount={neutronCount}
        elementColor={elementColor}
      />

      {/* Electron shells */}
      {electronShells.map((electronCount, i) => {
        const baseDistance = 2.5 + (i === 0 ? nucleusScaleFactor * 0.8 : 0);
        const radius = baseDistance + (i * 0.8 + Math.pow(i, 1.2));

        const rotation = generateOrbitRotations(i, electronShells.length);

        return (
          <ElectronOrbit
            key={i}
            radius={radius}
            electronCount={electronCount}
            orbitColor={elementColor}
            electronColor="#ffffff"
            speed={1 / Math.sqrt(i + 1)} 
            rotation={rotation}
          />
        );
      })}
    </>
  );
};

function Atom3DModel({ element, elementColor, size = 300 }) {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: "100%", height: size, position: "relative" }}>
      {" "}
      <Canvas
        camera={{ position: [0, 3, 18], fov: 40 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />

        <directionalLight
          position={[10, 10, 10]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* The atom model */}
        <Atom element={element} elementColor={elementColor} />

        <OrbitControls
          enableZoom={true}
          minDistance={4}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
      {showControls && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "12px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            userSelect: "none",
            textAlign: "center",
            backdropFilter: "blur(4px)",
            boxShadow: `0 0 15px ${elementColor}80`,
            border: `1px solid ${elementColor}40`,
            transition: "opacity 0.3s ease-in-out",
            zIndex: 10,
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            Interactive 3D Model
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <div>
              <div>🖱️ Drag</div>
              <div style={{ fontSize: "10px", color: "#aaa" }}>Rotate view</div>
            </div>
            <div>
              <div>⚙️ Scroll</div>
              <div style={{ fontSize: "10px", color: "#aaa" }}>Zoom in/out</div>
            </div>
          </div>
        </div>
      )}
      {/* Element legend */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "8px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "6px",
          borderRadius: "4px",
          fontSize: "11px",
          userSelect: "none",
          backdropFilter: "blur(4px)",
          border: `1px solid ${elementColor}40`,
          zIndex: 5,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "white",
              marginRight: "5px",
              boxShadow: "0 0 4px white",
            }}
          ></div>
          <div>Electrons</div>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: elementColor,
              marginRight: "5px",
              boxShadow: `0 0 4px ${elementColor}`,
            }}
          ></div>
          <div>Protons</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: new THREE.Color(elementColor)
                .offsetHSL(0, -0.4, -0.2)
                .getStyle(),
              marginRight: "5px",
            }}
          ></div>
          <div>Neutrons</div>
        </div>
      </div>
    </div>
  );
}

Atom3DModel.propTypes = {
  element: PropTypes.shape({
    number: PropTypes.number.isRequired,
    atomic_mass: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
  }).isRequired,
  elementColor: PropTypes.string.isRequired,
  size: PropTypes.number,
};

ElectronOrbit.propTypes = {
  radius: PropTypes.number.isRequired,
  electronCount: PropTypes.number.isRequired,
  orbitColor: PropTypes.string.isRequired,
  electronColor: PropTypes.string.isRequired,
  speed: PropTypes.number,
  rotation: PropTypes.array,
};

Nucleus.propTypes = {
  protonCount: PropTypes.number.isRequired,
  neutronCount: PropTypes.number.isRequired,
  elementColor: PropTypes.string.isRequired,
};

Atom.propTypes = {
  element: PropTypes.shape({
    number: PropTypes.number.isRequired,
    atomic_mass: PropTypes.number.isRequired,
  }).isRequired,
  elementColor: PropTypes.string.isRequired,
};

export default Atom3DModel;
