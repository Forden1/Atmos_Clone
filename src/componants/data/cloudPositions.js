import * as THREE from 'three';
import { curvePoints } from './curveConfig.js';

// Generate cloud positions procedurally based on curve points
const generateCloudField = (curvePoints, density = 3, spread = 15) => {
  const clouds = [];
  
  // Add clouds around each curve segment
  curvePoints.forEach((point, index) => {
    if (index === 0) return; // Skip first point
    
    // Generate random clouds around this curve point
    for (let i = 0; i < density; i++) {
      const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * spread,        // Random X offset
        Math.random() * 8 + 2,                 // Random Y height (2-10)
        (Math.random() - 0.5) * spread + point.z // Random Z offset from curve
      );
      
      clouds.push([
        point.x + randomOffset.x,
        randomOffset.y,
        randomOffset.z
      ]);
    }
  });
  
  // Add some distant clouds for atmosphere
  const distantClouds = [
    [3,1,2],[-3,1,2], [4,2,3], [-4,2,3] , // Placeholder for spacing
    [-20, 8, -50], [25, 12, -80], [-30, 6, -100],
    [35, 10, -120], [-25, 15, -140], [20, 5, -160]
  ];
  
  return [...clouds, ...distantClouds];
};

export const cloudPositions = generateCloudField(curvePoints, 2, 12); // Reduced density for better performance