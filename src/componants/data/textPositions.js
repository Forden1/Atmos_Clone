import * as THREE from 'three';
import { curvePoints } from './curveConfig.js';

// Generate text positions based on curve points for better placement
const generateTextPosition = (curveIndex, offset = { x: 2, y: 2, z: 0 }) => {
  const point = curvePoints[curveIndex];
  return [
    point.x + offset.x,
    point.y + offset.y,
    point.z + offset.z
  ];
};

export const textPositions = [
  {
    position: generateTextPosition(2, { x: 5, y: 1.5, z: -5 }), // Near left bank
    title: 'Movies & Entertainment',
    subtitle: 'Enjoy our curated selection of films, including the classic Porco Rosso for your viewing pleasure',
    cameraRailDist: 2.2,
    rotation: [0, -Math.PI / 4, 0],

  },
  {
    position: generateTextPosition(4, { x: -1, y: 2, z: -2 }), // At climb section
    title: 'Premium Dining',
    subtitle: 'Savor gourmet meals prepared by world-class chefs at 30,000 feet',
    cameraRailDist: -1.8,
        rotation: [0, Math.PI / 8, 0],

  },
  {
    position: generateTextPosition(6, { x: -2, y: 2, z: 3 }), // During descent
    title: 'Luxury Comfort',
    subtitle: 'Experience unparalleled comfort in our spacious cabins with premium amenities',
    rotation: [0, -Math.PI / 4, 0],
    cameraRailDist: 1.5
  },
  {
    position: generateTextPosition(8, { x: -1, y: 2.5, z: -1 }), // Final climb
    title: 'Global Destinations',
    subtitle: 'Connect to over 200 destinations worldwide with seamless service',
    cameraRailDist: 0.0
  }
];