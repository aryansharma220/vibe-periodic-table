import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import * as THREE from "three";

// Component for a single electron orbit with electrons
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
  // Create initial positions for electrons
  useEffect(() => {
    if (electronCount > 0 && electrons.current.length === 0) {
      // Distribute electrons evenly around orbit with precise spacing
      for (let i = 0; i < electronCount; i++) {
        // Distribute at equal angles around the circle
        const angle = (i / electronCount) * Math.PI * 2;

        electrons.current.push({
          angle,
          // Use a very small offset for slight variation while maintaining overall spacing
          offset: Math.random() * 0.2 - 0.1, // Small random offset (-0.1 to 0.1)
          // Less variation in speed for more consistent spacing
          speedFactor: 0.95 + Math.random() * 0.1, // Slight speed variation (0.95-1.05)
        });
      }
    }
  }, [electronCount]);
  // Animate electrons
  useFrame((state) => {
    if (orbitRef.current && electrons.current.length > 0) {
      const time = state.clock.getElapsedTime();

      // Apply initial rotation from props then add gentle wobble
      orbitRef.current.rotation.x = rotation[0] + Math.sin(time * 0.2) * 0.03;
      orbitRef.current.rotation.y = rotation[1] + Math.cos(time * 0.15) * 0.03;
      orbitRef.current.rotation.z = rotation[2] + Math.sin(time * 0.1) * 0.01;
      // Calculate base rotation speed for this update
      const baseRotationAmount = 0.005 * speed;

      // Update each electron position while maintaining proper spacing
      electrons.current.forEach((electron, i) => {
        if (orbitRef.current.children[i + 1]) {
          // +1 to skip the orbit ring which is the first child
          // Update electron angle based on speed and time
          // The speed factor now has less variation to maintain more consistent spacing
          electron.angle += baseRotationAmount * electron.speedFactor;

          // Calculate electron position with correct 3D orbit alignment
          // Use small offset to maintain proper spacing while adding subtle variation
          const angularPosition = electron.angle + electron.offset;
          const x = radius * Math.cos(angularPosition);
          const z = radius * Math.sin(angularPosition);

          orbitRef.current.children[i + 1].position.x = x;
          orbitRef.current.children[i + 1].position.y = 0; // Keep electrons in the orbit plane
          orbitRef.current.children[i + 1].position.z = z;

          // Make electrons pulsate subtly
          // Use electron's position in the array to create phase difference
          // so electrons don't all pulse simultaneously
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
        // Calculate precise positions with exact angular spacing
        const angle = (i / electronCount) * Math.PI * 2;

        // Adjust electron size based on electron count to prevent overcrowding
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

// Nucleus component
const Nucleus = ({ protonCount, neutronCount, elementColor }) => {
  const nucleusRef = useRef();
  const particleRefs = useRef([]);

  // Pulsing animation for nucleus
  useFrame((state) => {
    if (nucleusRef.current) {
      const t = state.clock.getElapsedTime();
      nucleusRef.current.rotation.y = t * 0.1;
      nucleusRef.current.rotation.z = t * 0.05;

      // Slight "breathing" animation for nucleus
      const scale = 1 + Math.sin(t * 1.5) * 0.03;
      nucleusRef.current.scale.set(scale, scale, scale);

      // Move particles slightly within the nucleus - improved for more realistic motion
      particleRefs.current.forEach((ref, i) => {
        if (ref) {
          const offset = i * 100;
          // Create a pseudo-brownian motion for particles
          const moveX = Math.sin(t * 2 + offset) * 0.0008;
          const moveY = Math.cos(t * 1.5 + offset * 0.7) * 0.0008;
          const moveZ = Math.sin(t * 1 + offset * 1.3) * 0.0008;

          // Apply movement constraints so particles stay within nucleus
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
            // If particle is at the boundary, move it slightly inward
            ref.position.x -= ref.position.x * 0.001;
            ref.position.y -= ref.position.y * 0.001;
            ref.position.z -= ref.position.z * 0.001;
          }
        }
      });
    }
  });

  // Get color for protons and neutrons
  const protonColor = new THREE.Color(elementColor).offsetHSL(0, 0.1, 0.1);
  const neutronColor = new THREE.Color(elementColor).offsetHSL(0, -0.4, -0.2);
  // Calculate nucleus size based on particle count
  const totalParticles = protonCount + neutronCount;
  const nucleusSize = Math.max(
    0.8,
    Math.min(1.5, Math.pow(totalParticles / 10, 1 / 3))
  );

  // Export the nucleus size to allow Atom component to use it for spacing calculations
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
        // Calculate position within nucleus sphere with improved distribution
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * Math.PI * 2;
        // Use cubic root for more uniform distribution within sphere volume
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
        // Calculate position within nucleus sphere - use different seeding to avoid overlap with protons
        const theta = Math.acos(2 * (Math.random() * 0.99 + 0.01) - 1); // Avoid exact poles
        const phi = (Math.random() * 0.95 + 0.05) * Math.PI * 2; // Avoid exact overlaps
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

// Main Atom component
const Atom = ({ element, elementColor }) => {
  const electronCount = element.number;
  const protonCount = element.number;
  const neutronCount = Math.round(element.atomic_mass) - element.number;

  // Calculate a base scale factor for shell spacing based on element size
  // Larger atoms need more space between nucleus and first shell
  const nucleusScaleFactor = Math.pow(element.number / 10, 1 / 6);

  // Helper to distribute electrons in shells based on quantum mechanics principles
  const getElectronShells = () => {
    const shells = [];
    let remainingElectrons = electronCount;

    // Max electrons per shell according to 2n² rule: 2, 8, 18, 32, ...
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

    // If there are still electrons left, add them to the last shell
    if (remainingElectrons > 0) {
      shells[shells.length - 1] += remainingElectrons;
    }

    return shells;
  };

  const electronShells = getElectronShells();
  // Generate rotation angles for orbits in 3D space to make them distributed evenly
  const generateOrbitRotations = (shellIndex, totalShells) => {
    if (totalShells === 1) {
      return [0, 0, 0]; // Single shell, no rotation needed
    }

    // Use golden ratio to distribute orbit orientations more evenly
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    // Ensure we have good distribution even with few shells
    const adjustedIndex = shellIndex + 1;
    const adjustedTotal = Math.max(4, totalShells);

    // Calculate angles using spherical fibonacci distribution
    const y = 1 - (adjustedIndex / adjustedTotal) * 2; // Maps to -1 to 1
    const radius = Math.sqrt(1 - y * y);

    // Calculate rotation angles
    const theta = (2 * Math.PI * adjustedIndex) / goldenRatio;

    // Convert to Euler angles for proper 3D orientation
    const x = Math.asin(y); // Rotation around X-axis (tilt up/down)
    const z = theta; // Rotation around Z-axis (rotate around nucleus)

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

        // Calculate rotation for this orbit to distribute in 3D space
        const rotation = generateOrbitRotations(i, electronShells.length);

        return (
          <ElectronOrbit
            key={i}
            radius={radius}
            electronCount={electronCount}
            orbitColor={elementColor}
            electronColor="#ffffff"
            speed={1 / Math.sqrt(i + 1)} // Speed decreases with distance from nucleus (closer to physics)
            rotation={rotation}
          />
        );
      })}
    </>
  );
};

// Main exported component
function Atom3DModel({ element, elementColor, size = 300 }) {
  const [showControls, setShowControls] = useState(true);

  // Hide the controls hint after 5 seconds
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
        dpr={[1, 2]} // Responsive rendering for different pixel ratios
      >
        {/* Add a subtle ambient light to improve visibility */}
        <ambientLight intensity={0.3} />

        {/* Add a subtle directional light for more definition */}
        <directionalLight
          position={[10, 10, 10]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* The atom model */}
        <Atom element={element} elementColor={elementColor} />

        {/* Orbit controls with better configuration */}
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
      {/* Controls hint overlay */}
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
