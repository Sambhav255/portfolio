import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DOT_COUNT = 2400
const LAYERS = 5
const SPREAD = 22

// Simple deterministic noise for mountain peaks
function noise(x: number, z: number) {
  return (
    Math.sin(x * 0.7) * Math.cos(z * 0.5) * 0.5 +
    Math.sin((x + z) * 0.3) * 0.3 +
    Math.sin(x * 1.1 + z * 0.9) * 0.2 +
    0.5
  )
}

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uMorph;
  uniform vec3 uMouse;
  attribute float aDepth;
  attribute float aLayer;
  attribute vec3 aMountainPos;
  varying float vDepth;
  varying float vLayer;
  varying float vY;
  void main() {
    vec3 p = mix(position, aMountainPos, uMorph);
    float scroll = uScroll * 2.0 - 1.0;
    float layerOffset = aLayer * 0.4;
    p.y += scroll * (8.0 + layerOffset * 4.0) * (1.0 - uMorph);
    p.y += 0.6 * sin(p.x * 0.5 + uTime * 0.3) * (1.0 - aDepth) * (1.0 - uMorph);
    float mouseDist = distance(p.xy, uMouse.xy);
    float repelRadius = 2.0;
    float repelStrength = 0.8 * (1.0 - smoothstep(0.0, repelRadius, mouseDist));
    p.z -= repelStrength * uMorph;
    vDepth = aDepth;
    vLayer = aLayer;
    vY = p.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = (1.2 + aLayer * 0.4) * (120.0 / -mv.z);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = `
  uniform float uJourneyGlow;
  varying float vDepth;
  varying float vLayer;
  varying float vY;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float baseA = (1.0 - smoothstep(0.0, 0.45, d)) * (0.25 + vLayer * 0.08);
    float peakFactor = smoothstep(0.0, 3.0, vY);
    float a = baseA * (0.7 + 0.3 * peakFactor);
    vec3 navy = vec3(0.102, 0.102, 0.18);
    vec3 snowCream = vec3(0.969, 0.965, 0.953);
    vec3 soft = vec3(0.58, 0.57, 0.55);
    vec3 col = mix(navy, soft, vDepth * 0.7 + vLayer * 0.15);
    col = mix(col, snowCream, peakFactor * (0.6 + 0.4 * uJourneyGlow));
    a *= (1.0 + 0.3 * uJourneyGlow * peakFactor);
    gl_FragColor = vec4(col, a);
  }
`

interface FloatingDotsProps {
  scrollProgressRef: React.MutableRefObject<number>
  morphRef?: React.MutableRefObject<number>
  mouseRef?: React.MutableRefObject<THREE.Vector3>
  journeyGlowRef?: React.MutableRefObject<number>
}

export function FloatingDots({ scrollProgressRef, morphRef, mouseRef, journeyGlowRef }: FloatingDotsProps) {
  const ref = useRef<THREE.Points>(null)
  const { positions, mountainPositions, depths, layers } = useMemo(() => {
    const pos = new Float32Array(DOT_COUNT * 3)
    const mountainPos = new Float32Array(DOT_COUNT * 3)
    const dep = new Float32Array(DOT_COUNT)
    const lay = new Float32Array(DOT_COUNT)
    for (let i = 0; i < DOT_COUNT; i++) {
      const layer = Math.floor(Math.random() * LAYERS) / LAYERS
      const depth = -4 - layer * 6 - Math.random() * 4
      const spread = SPREAD * (0.7 + Math.random() * 0.6)
      const x = (Math.random() - 0.5) * spread * 2
      const z = depth
      const yNebula = (Math.random() - 0.5) * spread
      pos[i * 3] = x
      pos[i * 3 + 1] = yNebula
      pos[i * 3 + 2] = z

      const nx = (Math.random() - 0.5) * spread * 2
      const nz = -4 - layer * 6 - Math.random() * 4
      const n = Math.max(0, noise(nx, nz))
      const gaussian = 4.0 * Math.exp(-(nx * nx + nz * nz) / 8.0)
      const mountainY = gaussian * n
      mountainPos[i * 3] = nx
      mountainPos[i * 3 + 1] = mountainY
      mountainPos[i * 3 + 2] = nz

      dep[i] = Math.random()
      lay[i] = layer
    }
    return { positions: pos, mountainPositions: mountainPos, depths: dep, layers: lay }
  }, [])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aMountainPos', new THREE.BufferAttribute(mountainPositions, 3))
    g.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1))
    g.setAttribute('aLayer', new THREE.BufferAttribute(layers, 1))
    return g
  }, [positions, mountainPositions, depths, layers])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMorph: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uJourneyGlow: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (!ref.current?.material) return
    const mat = ref.current.material as THREE.ShaderMaterial
    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uScroll.value = scrollProgressRef.current
    if (morphRef) mat.uniforms.uMorph.value = morphRef.current
    if (mouseRef) mat.uniforms.uMouse.value.copy(mouseRef.current)
    if (journeyGlowRef) mat.uniforms.uJourneyGlow.value = journeyGlowRef.current
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
