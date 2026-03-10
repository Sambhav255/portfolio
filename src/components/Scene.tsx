import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { FloatingDots } from './FloatingDots'

const CAMERA_ANCHORS = [
  { position: [0, 0.2, 6] as [number, number, number], target: [0, 0, -2] as [number, number, number] },
  { position: [0, 0, 4] as [number, number, number], target: [0, 0, -4] as [number, number, number] },
  { position: [0, 0.3, 3.5] as [number, number, number], target: [0, 0, -6] as [number, number, number] },
  { position: [0, 0.2, 5] as [number, number, number], target: [0, 0, -8] as [number, number, number] },
]

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>
}

export function Scene({ scrollProgressRef }: SceneProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        background: '#F7F6F3',
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0.2, 6], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#F7F6F3']} />
        <CameraRig scrollProgressRef={scrollProgressRef} anchors={CAMERA_ANCHORS} />
        <FloatingDots scrollProgressRef={scrollProgressRef} />
      </Canvas>
    </div>
  )
}
