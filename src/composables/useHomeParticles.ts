import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/** 首页粒子背景（自原 Index.vue 提取） */
export function useHomeParticles(canvasRef: Ref<HTMLCanvasElement | null>) {
  let animationId = 0
  let resizeHandler: (() => void) | null = null

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cvs = canvas
    const context = ctx

    const resizeCanvas = () => {
      cvs.width = window.innerWidth
      cvs.height = window.innerHeight
    }
    resizeCanvas()
    resizeHandler = resizeCanvas
    window.addEventListener('resize', resizeCanvas)

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * cvs.width
        this.y = Math.random() * cvs.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.5 ? '147, 197, 253' : '248, 113, 113'
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > cvs.width) this.x = 0
        if (this.x < 0) this.x = cvs.width
        if (this.y > cvs.height) this.y = 0
        if (this.y < 0) this.y = cvs.height
      }

      draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(${this.color}, ${this.opacity})`
        context.fill()
      }
    }

    const particles: Particle[] = []
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30))
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 150) {
            context.beginPath()
            context.strokeStyle = `rgba(147, 197, 253, ${0.15 * (1 - distance / 150)})`
            context.lineWidth = 0.5
            context.moveTo(particles[i].x, particles[i].y)
            context.lineTo(particles[j].x, particles[j].y)
            context.stroke()
          }
        }
      }
    }

    const animate = () => {
      context.clearRect(0, 0, cvs.width, cvs.height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      connectParticles()
      animationId = requestAnimationFrame(animate)
    }

    animate()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
  })
}
