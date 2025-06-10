"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Github, Mail, Linkedin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { TimeDisplay } from "@/components/time-display"

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [age, setAge] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [currentColor, setCurrentColor] = useState("#000000")

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB"
  ]

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Calculate precise age with 9 decimal places
    const calculateAge = () => {
      const dob = new Date("2003-08-06T00:00:00")
      const now = new Date()

      const diffInMs = now.getTime() - dob.getTime()
      const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25)

      return Number(diffInYears.toFixed(9))
    }

    setAge(calculateAge())

    // Update age every 50ms for smooth running clock effect
    const interval = setInterval(() => {
      setAge(calculateAge())
    }, 1)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.lineJoin = "round"
        ctx.lineCap = "round"
        ctx.lineWidth = 3
        ctx.strokeStyle = currentColor
        setContext(ctx)
      }

      const handleResize = () => {
        if (canvas && ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          ctx.lineJoin = "round"
          ctx.lineCap = "round"
          ctx.lineWidth = 3
          ctx.strokeStyle = currentColor
          ctx.putImageData(imageData, 0, 0)
        }
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [isDrawing])

  useEffect(() => {
    // Update stroke color when color changes, but don't clear the canvas
    if (context) {
      context.strokeStyle = currentColor
    }
  }, [currentColor, context])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return
    setDrawing(true)

    const position = getPosition(e)
    context.beginPath()
    context.moveTo(position.x, position.y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || !context) return
    
    const position = getPosition(e)
    context.lineTo(position.x, position.y)
    context.stroke()
  }

  const endDrawing = () => {
    setDrawing(false)
  }

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    let x, y

    if ("touches" in e) {
      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      x = touch.clientX - rect.left
      y = touch.clientY - rect.top
    } else {
      const rect = canvas.getBoundingClientRect()
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    return { x, y }
  }

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const links = [
    { name: "GitHub", href: "https://github.com/robinroy03", icon: <Github className="h-5 w-5 fill-current" /> },
    {
      name: "𝕏",
      href: "https://x.com/_RobinRoy",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/robinroy2003/", icon: <Linkedin className="h-5 w-5" /> },
    { name: "Email", href: "mailto:robinroy.work@gmail.com", icon: <Mail className="h-5 w-5" /> },
  ]

  // Format age with fixed width using monospace font
  const formattedAge = age.toFixed(9).padStart(13, ' ')

  return (
    <main 
      className="min-h-screen relative"
      style={{
        backgroundImage: !isDrawing && isMobile ? 'url("/indiagate6.png")' : 'none',
        backgroundColor: !isDrawing && !isMobile ? '#3b82f6' : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Drawing Canvas */}
      {isDrawing && (
        <div className="fixed inset-0 z-50 bg-background">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="w-full h-full cursor-crosshair touch-none"
            style={{ 
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              overscrollBehavior: 'none'
            }}
          />

          {/* Drawing Controls and Theme Toggle - Top Right */}
          <div className="fixed top-4 right-4 flex flex-col items-end gap-2 z-60 pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
              <button
                onClick={clearCanvas}
                className="text-blue-600 hover:text-red-500 transition-colors font-sans text-sm underline decoration-dotted decoration-1 underline-offset-4"
              >
                clear
              </button>
              <button
                onClick={() => setIsDrawing(false)}
                className="text-blue-600 hover:text-foreground transition-colors font-sans text-sm underline decoration-dotted decoration-1 underline-offset-4"
              >
                exit
              </button>
            </div>
            <div className="pointer-events-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Color Picker - Bottom Center */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-60">
            <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
              <div className="grid grid-cols-5 md:flex md:gap-2 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-8 h-8 shrink-0 rounded-full border-2 transition-all hover:scale-110 ${currentColor === color ? 'border-foreground scale-110' : 'border-muted'
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Display - Top Left */}
      <div className="fixed top-4 left-4 z-40">
        <TimeDisplay isDrawing={isDrawing} />
      </div>

      {/* Enable Drawing Link - Top Right (no theme toggle when not drawing) */}
      {!isDrawing && (
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={() => setIsDrawing(true)}
            className="text-white hover:text-gray-200 transition-colors font-sans text-sm underline decoration-dotted decoration-1 underline-offset-4"
          >
            enable drawing
          </button>
        </div>
      )}

      <div className={`max-w-3xl mx-auto px-4 ${
        isMobile ? 'pt-36' : 'pt-22 flex flex-col justify-center min-h-screen'
      }`}>
        <div className={`text-center ${isMobile ? 'mb-2' : 'mb-12'}`}>
          {/* Name in Bodoni style - responsive sizing */}
          <h1 className={`${
            isMobile ? 'text-6xl' : 'text-6xl md:text-8xl'
          } font-bodoni font-bold mb-6 ${!isDrawing ? 'text-white' : 'text-blue-600'}`} style={{ letterSpacing: '-0.5px' }}>
            Robin Roy
          </h1>

          <p className={`${
            isMobile ? 'text-base' : 'max-w-lg mx-auto'
          } font-sans ${!isDrawing ? 'text-white' : 'text-blue-600'}`}>
            Welcome to my little place on the internet. I&apos;m a{" "}
            <span className="font-mono tabular-nums">{formattedAge}</span>{" "}
            year old from India.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link, index) => (
              <div key={link.name} className="flex items-center">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative px-3 py-2 transition-all duration-200 ${!isDrawing ? 'text-white hover:text-gray-200' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  <span className="inline-block transition-all group-hover:opacity-0">
                    {link.name}
                  </span>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100">
                    {link.icon}
                  </span>
                </a>
                {index < links.length - 1 && (
                  <span className={`px-0.5 ${!isDrawing ? 'text-white/30' : 'text-blue-600/30'}`}>/</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
