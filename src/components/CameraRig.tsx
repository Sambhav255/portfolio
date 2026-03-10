import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

interface Anchor {
  position: [number, number, number]
  target: [number, number, number]
}

interface CameraRigProps {
  scrollProgressRef: React.MutableRefObject<number>
  anchors: Anchor[]
}

export function CameraRig({ scrollProgressRef, anchors }: CameraRigProps) {
  const vec = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())

  useFrame((state) => {
    const progress = scrollProgressRef.current
    const n = anchors.length - 1
    const segment = Math.min(Math.floor(progress * n), n - 1)
    const t = progress * n - segment
    const i = Math.min(segment, n - 1)
    const j = Math.min(segment + 1, n)

    const posA = anchors[i].position
    const posB = anchors[j].position
    const targetA = anchors[i].target
    const targetB = anchors[j].target

    vec.current.set(
      lerp(posA[0], posB[0], t),
      lerp(posA[1], posB[1], t),
      lerp(posA[2], posB[2], t)
    )
    targetVec.current.set(
      lerp(targetA[0], targetB[0], t),
      lerp(targetA[1], targetB[1], t),
      lerp(targetA[2], targetB[2], t)
    )

    state.camera.position.lerp(vec.current, 0.1)
    state.camera.lookAt(targetVec.current)
    state.camera.updateProjectionMatrix()
  })

  return null
}
