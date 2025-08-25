import { Environment, shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import { extend, useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"

const BackgroundMaterial  = shaderMaterial(
  {
    topColor: new THREE.Color("#0000ff"),   // deep blue
    bottomColor: new THREE.Color("#ffffff"), // white
    cutoff: 0.36
  },
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    varying vec2 vUv;
    uniform float cutoff;
    void main() {
      float t = smoothstep(cutoff, 0.65, vUv.y);
      vec3 mixedColor = mix(bottomColor, topColor, t);
       
      gl_FragColor = vec4(mixedColor, 1.0);
    }
  `
)

extend({ BackgroundMaterial })

export default function Background({backgroundColors}) {
  const matRef = useRef();
  const envMatRef = useRef(); // Add separate ref for environment
  const environmentRef = useRef();
  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.topColor.value.set(backgroundColors.current.topColor);
      matRef.current.uniforms.bottomColor.value.set(backgroundColors.current.bottomColor);
    }
    // Update environment material too
    if (envMatRef.current) {
      envMatRef.current.uniforms.topColor.value.set(backgroundColors.current.bottomColor);
      envMatRef.current.uniforms.bottomColor.value.set(backgroundColors.current.topColor);
    }
        if (environmentRef.current) {
      environmentRef.current.update();
    }
  });

  return (
    <>
      <Environment  frames={Infinity} ref={environmentRef} resolution={256} >
          <mesh scale={[10, 10, 10]}>
        <sphereGeometry args={[3, 3,3]}  />
        <backgroundMaterial
          ref={envMatRef} // Use different ref
          side={THREE.BackSide}
          cutoff={0.36}
        />
        </mesh>
      </Environment>

      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[3, 3,3]}  />
        <backgroundMaterial
          ref={matRef}
          side={THREE.BackSide}
          cutoff={0.36}
        />
      </mesh>
    </>
  )
}
