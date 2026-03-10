import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DOT_COUNT = 2400
const LAYERS = 5
const SPREAD = 22

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  attribute float aDepth;
  attribute float aLayer;
  varying float vDepth;
  varying float vLayer;
  void main() {
    vec3 p = position;
    float scroll = uScroll * 2.0 - 1.0;
    float layerOffset = aLayer * 0.4;
    p.y += scroll * (8.0 + layerOffset * 4.0);
    p.y += 0.6 * sin(p.x * 0.5 + uTime * 0.3) * (1.0 - aDepth);
    vDepth = aDepth;
    vLayer = aLayer;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = (1.2 + aLayer * 0.4) * (120.0 / -mv.z);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = `
  varying float vDepth;
  varying float vLayer;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = (1.0 - smoothstep(0.0, 0.45, d)) * (0.25 + vLayer * 0.08);
    vec3 navy = vec3(0.102, 0.102, 0.18);
    vec3 soft = vec3(0.58, 0.57, 0.55);
    vec3 col = mix(navy, soft, vDepth * 0.7 + vLayer * 0.15);
    gl_FragColor = vec4(col, a);
  }
`

export function FloatingDots({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, depths, layers } = useMemo(() => {
    const pos = new Float32Array(DOT_COUNT * 3)
    const dep = new Float32Array(DOT_COUNT)
    const lay = new Float32Array(DOT_COUNT)
    for (let i = 0; i < DOT_COUNT; i++) {
      const layer = Math.floor(Math.random() * LAYERS) / LAYERS
      const depth = -4 - layer * 6 - Math.random() * 4
      const spread = SPREAD * (0.7 + Math.random() * 0.6)
      pos[i * 3] = (Math.random() - 0.5) * spread * 2
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread
      pos[i * 3 + 2] = depth
      dep[i] = Math.random()
      lay[i] = layer
    }
    return { positions: pos, depths: dep, layers: lay }
  }, [])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1))
    g.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1))
    return g
  }, [positions, depths, layers])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (!ref.current?.material) return
    const mat = ref.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uScroll.value = scrollProgressRef.current
  })

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}
