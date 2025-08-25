import { Text } from "@react-three/drei";
import {textPositions} from "./data/textPositions";
import {fadeOnBeforeCompileFlat} from './utils/faedMaterial'
import {fadeOnBeforeCompile} from './utils/faedMaterial'

function TextSection({ position, title, subtitle,...props }) {
    return (
        <>
            <Text
                position={position}
                fontSize={0.52}
                maxWidth={2.5}
                lineHeight={1.5}
                anchorX="left"
                anchorY="bottom"
            >
                {title}
                      <meshStandardMaterial
            color={"white"}
            onBeforeCompile={fadeOnBeforeCompileFlat}
          />
        </Text>
        <Text
            position={position}
            fontSize={0.2}
            anchorX="left"
            anchorY="top"
            maxWidth={2.5}
        >
            {subtitle}
                     <meshStandardMaterial
            color={"white"}
            onBeforeCompile={fadeOnBeforeCompileFlat}
          />
        </Text>
        </>
    );
}
export default function TextSections() {
  return (
    <>
      {textPositions.map((text, index) => (
        <TextSection
          key={index}
          position={text.position}
          title={text.title}
          subtitle={text.subtitle}
        />
      ))}
    </>
  )
}

