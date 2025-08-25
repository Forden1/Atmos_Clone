import {   Float, PerspectiveCamera,  useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo, useLayoutEffect, useEffect } from "react";
import Background from "./Background";
import Cloud from "./Cloud";
import Plane from "./Plane";
import TextSections from "./TextSections";
import { textPositions } from "./data/textPositions";
import { curvePoints, FLIGHT_CONFIG } from "./data/curveConfig"; // Import from config
import { cloudPositions } from "./data/cloudPositions"; // Import cloud positions
import gsap from "gsap";
import {fadeOnBeforeCompile} from './utils/faedMaterial'

export default function Experience({start, end, setEnd}) {
  // Use imported curve points instead of hardcoded ones
 
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      curvePoints,
      false,
      "catmullrom",
      0.4 // Smoother tension
    );
  }, []);
   const tl = useRef();
  const backgroundColors = useRef({
    topColor: "#3535cc",
    bottomColor: "#abaadd",
  });

  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    tl.current.to(backgroundColors.current, {
      duration: 1,
      topColor: "#6f35cc",
      bottomColor: "#ffad30",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      topColor: "#424242",
      bottomColor: "#ffcc00",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      topColor: "#81318b",
      bottomColor: "#55ab8f",
    });
    tl.current.pause();
  }, []);

  const linePoints = useMemo(() => curve.getPoints(FLIGHT_CONFIG.NB_LINE_POINTS), [curve]);
  
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.15); // Thinner flight path
    shape.lineTo(0, 0.15);
    return shape;
  }, []);

  const cameraRailRef = useRef();
  const planeRef = useRef();
  const cameraGroupRef = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);
   useEffect(() => {
    if (!start) return;
    gsap.to(planeRef.current.position, {
    z: 0,
      duration: 4,
      ease: "power2.out",
    });
  }, [start]);
  useEffect(() => {
    if (!end) return;
    gsap.to(planeRef.current.position, {
      y: 10,
      z: -300,
      duration: 3,
      ease: "power2.inOut",
    });
  
  }, [end]);
  useFrame((state, delta) => {
    if (!start) return;
    if (end) return;
    let t = Math.min(scroll.offset, 1);
    t = Math.max(t, 0);
    let friction = 1;
    let resetCameraRail = true;

    const point = curve.getPointAt(t);
    if(point.distanceTo(curvePoints[curvePoints.length - 1]) < 10){
      setEnd(true);
    }
    // Dynamic camera positioning based on text sections
    textPositions.forEach((text) => {
      const distance = point.distanceTo(new THREE.Vector3(...text.position));

      if (distance < FLIGHT_CONFIG.FRICTION_DISTANCE) {
        friction = Math.max(distance / FLIGHT_CONFIG.FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FLIGHT_CONFIG.FRICTION_DISTANCE) * text.cameraRailDist,
          0,
          0
        );
        cameraRailRef.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });

    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRailRef.current.position.lerp(targetCameraRailPosition, delta);
    }

    t = THREE.MathUtils.lerp(lastScroll.current, scroll.offset, delta * friction);
    lastScroll.current = scroll.offset;

    tl.current.seek(t * tl.current.duration()); // Sync timeline with scroll

    // Smooth camera movement - KEPT YOUR ORIGINAL LOGIC
    const lookAtPoint = curve.getPointAt(Math.min(t + FLIGHT_CONFIG.CURVE_AHEAD_CAMERA, 1));
    cameraGroupRef.current.position.lerp(point, delta * FLIGHT_CONFIG.CAMERA_LERP_SPEED);
    const currentLookAt = cameraGroupRef.current.getWorldDirection(new THREE.Vector3());
    const targetLookAt = new THREE.Vector3()
      .subVectors(point, lookAtPoint) 
      .normalize();
    const lookAt = currentLookAt.lerp(targetLookAt, delta * FLIGHT_CONFIG.CAMERA_LERP_SPEED);
    cameraGroupRef.current.lookAt(cameraGroupRef.current.position.clone().add(lookAt));
    
    // Enhanced plane movement with realistic banking
    const nonLerpLookAt = new THREE.Group();
    nonLerpLookAt.position.copy(point);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));
    const tangent = curve.getTangent(Math.min(t + FLIGHT_CONFIG.CURVE_AHEAD_AIRPLANE, 1));
    tangent.applyAxisAngle(new THREE.Vector3(0, 1, 0), -nonLerpLookAt.rotation.y);
    let angle = Math.atan2(tangent.x, -tangent.z);
    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.8; // More dramatic banking

    // Limit plane banking angle
    angleDegrees = Math.max(Math.min(angleDegrees, FLIGHT_CONFIG.AIRPLANE_MAX_ANGLE), -FLIGHT_CONFIG.AIRPLANE_MAX_ANGLE);
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        planeRef.current.rotation.x,
        planeRef.current.rotation.y,
        angle
      )
    );
    planeRef.current.quaternion.slerp(targetAirplaneQuaternion, delta * FLIGHT_CONFIG.PLANE_LERP_SPEED);
  });

  return (
    <> 
      <group ref={cameraGroupRef}>
      <Background backgroundColors={backgroundColors} />
        <group ref={cameraRailRef}>
          <PerspectiveCamera position={[0, 1, 6]} makeDefault /> {/* Adjusted camera position */}
        </group>
       <Float floatIntensity={1} rotationIntensity={0.0} speed={5} >
         <group ref={planeRef} position={[0, 0, 10]}>
          <Plane />
        </group>
       </Float>
      </group>

     { start && (cloudPositions.map((position, index) => (
        <Cloud key={index} position={position} />
      )))}

     {start && <mesh position-y={-1.5}> {/* Adjusted ground level */}
        <extrudeGeometry args={[shape, {extrudePath: curve, steps: FLIGHT_CONFIG.NB_LINE_POINTS, bevelEnabled: false}]}/>
        <meshStandardMaterial transparent={true} opacity={0.3} color={"#87CEEB"} onBeforeCompile={fadeOnBeforeCompile} /> {/* Sky blue color */}
      </mesh>}
      <TextSections />
      <ambientLight intensity={0.6} /> {/* Brighter ambient light */}
      <directionalLight position={[10, 10, 5]} intensity={0.4} /> {/* Added directional light */}
    </>
  );
}
