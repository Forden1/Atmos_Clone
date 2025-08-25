import * as THREE from 'three';

// More natural flight path with smoother curves and better visual flow


// Flight parameters for better visual experience
export const FLIGHT_CONFIG = {
  NB_LINE_POINTS: 1200,              // Smoother curve resolution
  CURVE_AHEAD_CAMERA: 0.012,         // More responsive camera
  CURVE_AHEAD_AIRPLANE: 0.025,       // Better plane tracking
  AIRPLANE_MAX_ANGLE: 40,            // More dynamic banking
  FRICTION_DISTANCE: 8,              // Larger interaction zone
  CAMERA_LERP_SPEED: 18,             // Smoother camera movement
  PLANE_LERP_SPEED: 2.5,             // More responsive plane rotation
  CURVE_DISTANCE: 20,

};
export const curvePoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, -FLIGHT_CONFIG.CURVE_DISTANCE),
  new THREE.Vector3(-2, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*2),
  new THREE.Vector3(-3, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*3),
  new THREE.Vector3(0, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*4),
  new THREE.Vector3(5, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*5),
  new THREE.Vector3(7, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*6),
  new THREE.Vector3(5, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*7),
  new THREE.Vector3(0, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*8),
  new THREE.Vector3(0, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*9),
  new THREE.Vector3(0, 0, -FLIGHT_CONFIG.CURVE_DISTANCE*10),
];