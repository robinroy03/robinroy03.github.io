"use client"

import { useState, useRef, useEffect } from "react"

export default function KissPage() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false
            setIsMuted(false)
        }
    }

    const handleClick = async () => {
        // Unmute video
        handleUnmute()

        // Request fullscreen
        const container = document.documentElement
        try {
            if (container.requestFullscreen) {
                await container.requestFullscreen()
            } else if ((container as any).webkitRequestFullscreen) {
                // Safari
                await (container as any).webkitRequestFullscreen()
            } else if ((container as any).mozRequestFullScreen) {
                // Firefox
                await (container as any).mozRequestFullScreen()
            } else if ((container as any).msRequestFullscreen) {
                // IE/Edge
                await (container as any).msRequestFullscreen()
            }
        } catch (error) {
            // Fullscreen may fail, but unmute still works
            console.error("Fullscreen request failed:", error)
        }
    }

    return (
        <div
            className="fixed inset-0 w-full h-full bg-black cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}
        >
            <video
                key={isMobile ? "mobile" : "desktop"}
                ref={videoRef}
                src={isMobile ? "/sabrina_phone.mp4" : "/Sabrina.webm"}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                loop={true}
                controls={false}
                style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    backgroundColor: 'black'
                }}
            />

            {/* Unmute button - shows on hover (desktop) or always (mobile) */}
            {isMuted && (isHovered || isMobile) && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClick()
                    }}
                    className={`fixed bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all ${isMobile ? 'top-4 right-4' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        }`}
                    style={{
                        zIndex: 10000
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                </button>
            )}
        </div>
    )
}

