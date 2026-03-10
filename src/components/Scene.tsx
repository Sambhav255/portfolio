import { useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { FloatingDots } from './FloatingDots'

const CAMERA_ANCHORS = [
  { position: [0, 0.2, 6] as [number, number, number], target: [0, 0, -2] as [number, number, number] },
  { position: [4, 2, 8] as [number, number, number], target: [0, 1, 0] as [number, number, number] },
  { position: [0, 0.3, 3.5] as [number, number, number], target: [0, 0, -6] as [number, number, number] },
  { position: [0, 0.2, 5] as [number, number, number], target: [0, 0, -8] as [number, number, number] },
]

function MouseTracker({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector3> }) {
  const { camera, pointer } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, -1), 0))
  const target = useRef(new THREE.Vector3())

  useFrame(() => {
    raycaster.current.setFromCamera(pointer, camera)
    plane.current.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0, 0)
    )
    raycaster.current.ray.intersectPlane(plane.current, target.current)
    if (target.current) mouseRef.current.copy(target.current)
  })

  return null
}

interface SceneProps {
  scrollProgressRef: React.MutableRefObject<number>
  morphProgressRef?: React.MutableRefObject<number>
  journeyGlowRef?: React.MutableRefObject<number>
}

export function Scene({ scrollProgressRef, morphProgressRef, journeyGlowRef }: SceneProps) {
  const mouseRef = useRef(new THREE.Vector3(0, 0, -10))

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
        <fog attach="fog" args={['#F7F6F3', 5, 15]} />
        <CameraRig scrollProgressRef={scrollProgressRef} anchors={CAMERA_ANCHORS} />
        <MouseTracker mouseRef={mouseRef} />
        <FloatingDots
          scrollProgressRef={scrollProgressRef}
          morphRef={morphProgressRef}
          mouseRef={mouseRef}
          journeyGlowRef={journeyGlowRef}
        />
      </Canvas>
    </div>
  )
}
