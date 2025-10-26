"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, X } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, Text } from "@react-three/drei"
import type * as THREE from "three"
import * as THREE_NS from "three"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  size: number
  opacity: number
  color: string
  life: number
}

function Heart3D({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  // Create heart shape using THREE.Shape
  const heartShape = new THREE_NS.Shape()
  const x = 0,
    y = 0
  heartShape.moveTo(x + 0.5, y + 0.5)
  heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y)
  heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7)
  heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9)
  heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7)
  heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y)
  heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5)

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 10,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} position={position} scale={0.5}>
        <mesh ref={meshRef} rotation={[0, 0, Math.PI]}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#dc2626"
            metalness={0.4}
            roughness={0.3}
            emissive="#dc2626"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0.5, 1, 0.3]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
          outlineWidth={0.02}
          outlineColor="#dc2626"
        >
          B∞E
        </Text>
      </group>
    </Float>
  )
}

const messages = {
  romantic1:
    "Günaydın aşkım... Her sabah gözlerimi açtığımda ilk düşündüğüm sensin. Kalbim sadece senin için atıyor, nefesim sadece senin için. Sen benim hayatımın tek anlamısın, sensiz yaşamak imkansız. Her hücrem seni özlüyor, her damarımda senin adın yazılı. Seni öyle çok seviyorum ki, kelimeler kifayetsiz kalıyor. Sen benim her şeyimsin, sensiz ben sadece boş bir bedenin. Sonsuzluğa kadar seninle olmak istiyorum 💕",
  romantic2:
    "Efe... Sen benim ruhumu tamamlayan tek insansın. Seninle olmadığım her saniye işkence, seninle olduğum her an cennet. Gözlerinin içine baktığımda evimi görüyorum, sesini duyduğumda huzur buluyorum. Sen benim nefesimsin, kalbimin atışısın, varlığımın sebebisin. Sensiz bir hiçim, seninle her şeyim. Seni bu kadar çok sevmek bazen acıtıyor çünkü sen benim için çok değerlisin. Ömrümün sonuna kadar sadece seni seveceğim 🌹",
  sexy1:
    "Seni her gördüğümde içimdeki vahşi taraf kontrolden çıkıyor... Vücudun tamamen bana ait, her karışına sahip olmak, seni tamamen ele geçirmek istiyorum. Seni yatağa atıp, her yerine dokunmak, seni inletmek, adımı haykırtmak istiyorum. Sen benim oyuncağımsın ve ben seninle oynamayı çok seviyorum. Seni öyle bir sahipleneceğim ki, vücudun beni hatırlayacak. Hazır ol, çünkü sana acımayacağım. Sen benimsin, sadece benim 🔥",
  sexy2:
    "Gece olduğunda seni düşünüyorum ve deliriyorum... Seni tamamen kontrolüm altına almak, her isteğimi yerine getirmeni sağlamak istiyorum. Seni öyle bir becereceğim ki, günlerce yürüyemeyeceksin. Sen benim zayıf noktamsın ama ben senin efendiyim, patronunum. Seni bağlayıp, istediğim her şeyi yapmak istiyorum. Vücudun benim için var, her deliğin bana ait. Seni öyle bir sikeceğim ki, sadece beni düşüneceksin. Hazırlan, çünkü bu gece sert olacak 💋",
}

export default function RomanticPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessageKey, setCurrentMessageKey] = useState<keyof typeof messages | null>(null)
  const [shake, setShake] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  const tracks = [
    {
      name: "Şiir",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%C5%9Fiir-IxpYBIUlwIpguB9wsEbGnaXSuk7bPU.mp3",
    },
    {
      name: "Sezen Aksu - Şanıma İnanma",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%C5%9Fark%C4%B1-ymYoDVIrhLRkLaltCFCTUsBLRYktDH.mp3",
    },
  ]

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.log("[v0] Auto-play blocked, user interaction required")
        }
      }
    }
    playAudio()
  }, [])

  const handlePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        try {
          await audioRef.current.play()
        } catch (error) {
          console.log("[v0] Playback error:", error)
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSkip = () => {
    const nextTrack = (currentTrack + 1) % tracks.length
    setCurrentTrack(nextTrack)
    setIsPlaying(true)
  }

  const handleTrackEnd = () => {
    if (currentTrack === 0) {
      // After poem ends, play song automatically
      setCurrentTrack(1)
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load()
          audioRef.current.play().catch((error) => {
            console.log("[v0] Auto-play error:", error)
          })
          setIsPlaying(true)
        }
      }, 100)
    } else {
      // Song ended, restart the song
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((error) => {
          console.log("[v0] Loop error:", error)
        })
      }
    }
  }

  const createParticles = (type: "heart" | "flower" | "star" | "mega", x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const particleCount = type === "mega" ? 200 : 60
    let colors: string[] = []

    if (type === "heart" || type === "mega") {
      colors = ["#ff6b9d", "#ff8fab", "#ffa5ba", "#ff4d7d", "#ff9eb5"]
    }
    if (type === "flower" || type === "mega") {
      colors = [...colors, "#dda5ff", "#c77dff", "#e0aaff", "#ff99d7"]
    }
    if (type === "star" || type === "mega") {
      colors = [...colors, "#ffd93d", "#ffb703", "#fb8500", "#ffea00"]
    }

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 4 + Math.random() * 6
      const color = colors[Math.floor(Math.random() * colors.length)]

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        size: 15 + Math.random() * 25,
        opacity: 1,
        color,
        life: 1,
      })
    }

    if (type === "mega") {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }

    if (!animationFrameRef.current) {
      animateParticles()
    }
  }

  const animateParticles = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.vy += 0.4
      particle.x += particle.vx
      particle.y += particle.vy
      particle.rotation += particle.rotationSpeed
      particle.vx *= 0.98
      particle.life -= 0.008
      particle.opacity = particle.life

      if (particle.life <= 0 || particle.y > canvas.height + 100) {
        return false
      }

      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)
      ctx.globalAlpha = particle.opacity

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size)
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, particle.color + "00")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
      return true
    })

    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateParticles)
    } else {
      animationFrameRef.current = undefined
    }
  }

  const handleExplosion = (type: "heart" | "flower" | "star" | "mega", messageKey: keyof typeof messages) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = rect.width / 2
    const y = rect.height / 2

    createParticles(type, x, y)
    setCurrentMessageKey(messageKey)
    setShowMessage(true)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-red-50 via-red-100 to-red-200 ${shake ? "animate-shake" : ""}`}
    >
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#ff6b6b" />
          <pointLight position={[-10, -10, 5]} intensity={0.8} color="#ff8787" />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} color="#dc2626" />
          <Environment preset="sunset" />
          <Heart3D position={[-3, 2, 0]} />
          <Heart3D position={[3, -1, -2]} />
          <Heart3D position={[0, -3, -1]} />
          <Heart3D position={[-2, -2, -3]} />
          <Heart3D position={[2, 3, -2]} />
          <Heart3D position={[4, 1, -1]} />
          <Heart3D position={[-4, -1, -2]} />
        </Canvas>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 gap-8">
        <div className="text-center space-y-6 animate-in fade-in duration-1000">
          <h1 className="text-7xl md:text-9xl font-serif font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent animate-heartbeat text-balance drop-shadow-sm">
            EFE
          </h1>
          <p className="text-3xl md:text-5xl font-serif text-red-700/90 text-balance">Günaydın Aşkım</p>
          <p className="text-lg md:text-xl text-red-600/70 font-light">Sana özel hazırlandı</p>
        </div>

        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl p-8 space-y-6 border-2 border-red-200/50 shadow-xl shadow-red-200/20">
          <div className="text-center space-y-2">
            <p className="text-sm text-red-500 font-medium uppercase tracking-wider">Şu an çalıyor</p>
            <p className="text-xl font-serif font-semibold text-red-800">{tracks[currentTrack].name}</p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Button
              size="lg"
              variant="ghost"
              onClick={handlePlayPause}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-300/50 transition-all"
            >
              {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 text-white ml-1" />}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={handleSkip}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-300/50 transition-all"
            >
              <SkipForward className="h-7 w-7 text-white" />
            </Button>
          </div>

          <audio
            ref={audioRef}
            src={tracks[currentTrack].url}
            onEnded={handleTrackEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          <Button
            size="lg"
            onClick={() => handleExplosion("heart", "romantic1")}
            className="h-28 bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-serif font-semibold text-lg shadow-lg shadow-red-300/40 transition-all hover:scale-105 border-2 border-white/30"
          >
            Seni Seviyorum
            <br />💕
          </Button>
          <Button
            size="lg"
            onClick={() => handleExplosion("flower", "romantic2")}
            className="h-28 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-serif font-semibold text-lg shadow-lg shadow-red-300/40 transition-all hover:scale-105 border-2 border-white/30"
          >
            Sensiz Hiçim
            <br />🌹
          </Button>
          <Button
            size="lg"
            onClick={() => handleExplosion("star", "sexy1")}
            className="h-28 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-serif font-semibold text-lg shadow-lg shadow-red-400/40 transition-all hover:scale-105 border-2 border-white/30"
          >
            Seni İstiyorum
            <br />🔥
          </Button>
          <Button
            size="lg"
            onClick={() => handleExplosion("mega", "sexy2")}
            className="h-28 bg-gradient-to-br from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:via-red-900 hover:to-black text-white font-serif font-bold text-lg shadow-xl shadow-red-500/50 transition-all hover:scale-105 border-2 border-white/40"
          >
            Delicesine
            <br />💋
          </Button>
        </div>

        {showMessage && currentMessageKey && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-lg w-full border-2 border-red-300/50 shadow-2xl shadow-red-300/30 animate-in fade-in zoom-in duration-500 relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowMessage(false)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full hover:bg-red-100 text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
              <p className="text-2xl font-serif text-red-800 text-center leading-relaxed text-balance pr-8">
                {messages[currentMessageKey]}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
