"use client"

import { useEffect, useState } from "react"
import { Github, Mail, Linkedin } from "lucide-react"
import { TimeDisplay } from "@/components/time-display"
import { ExcalidrawBoard } from "@/components/excalidraw-board"
import { TextEditor } from "@/components/text-editor"

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [age, setAge] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

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
      const dob = new Date("2003-08-06T00:00:00+05:30")
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
        backgroundColor: !isDrawing && !isMobile ? '#2563eb' : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Sunlight glow effect for desktop */}
      {!isDrawing && !isMobile && (
        <>
          {/* Bottom sunlight glow spread across full width */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 100% 600px at 50% 100%, 
                rgba(255, 223, 0, 0.15) 0%, 
                rgba(255, 193, 7, 0.1) 20%, 
                rgba(255, 152, 0, 0.08) 35%, 
                rgba(255, 87, 34, 0.05) 50%, 
                transparent 70%)`
            }}
          />
        </>
      )}
      {/* Excalidraw Drawing Board */}
      {isDrawing && <ExcalidrawBoard onExit={() => setIsDrawing(false)} />}

      {/* Text Editor */}
      {isEditing && <TextEditor onExit={() => setIsEditing(false)} />}

      {/* Time Display - Top Left */}
      <div className="fixed top-4 left-4 z-40">
        <TimeDisplay isDrawing={isDrawing} />
      </div>

      {/* Top Right Links */}
      {!isDrawing && !isEditing && (
        <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-1">
          <button
            onClick={() => setIsDrawing(true)}
            className="text-white hover:text-gray-200 transition-colors font-sans text-sm underline decoration-dotted decoration-1 underline-offset-4"
          >
            open whiteboard
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-white hover:text-gray-200 transition-colors font-sans text-sm underline decoration-dotted decoration-1 underline-offset-4"
          >
            open text editor
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
