import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Canvas } from '@react-three/fiber'
import Experience from './componants/Experience.jsx'
import { Loader, OrbitControls, Scroll, ScrollControls } from '@react-three/drei'
import Interface from './componants/Interface.jsx'
import { EffectComposer, Noise } from '@react-three/postprocessing'

function App() {
  const [start, setStart] = useState(false)
  const [end, setEnd] = useState(false)

  return (
    <>
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ScrollControls pages={start&&!end ? 30 : 0} damping={0.5} >

          <Experience start={start} end={end} setEnd={setEnd} />


          </ScrollControls>
            <EffectComposer>
          <Noise opacity={0.1} />
        </EffectComposer>

      </Canvas>
       <Interface setStart={setStart} start={start} />
       <Loader />
    </>
  )
}

export default App
