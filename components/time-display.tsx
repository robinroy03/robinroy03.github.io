"use client"

import { useEffect, useState } from "react"

interface TimeDisplayProps {
  isDrawing: boolean
}

export function TimeDisplay({ isDrawing }: TimeDisplayProps) {
  const [userTime, setUserTime] = useState("")
  const [userDate, setUserDate] = useState("")
  const [indiaTime, setIndiaTime] = useState("")
  const [indiaDate, setIndiaDate] = useState("")
  const [timeDiff, setTimeDiff] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      // Calculate India time
      const indiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      const diffInHours = (indiaTime.getTime() - now.getTime()) / (1000 * 60 * 60)
      const absoluteDiff = Math.abs(diffInHours)
      
      if (absoluteDiff < 0.1) {
        setTimeDiff("oh, we both are in the same timezone!")
      } else {
        const diffText = diffInHours > 0 
          ? `oh, you're ${absoluteDiff.toFixed(1)} hours behind me!`
          : `oh, you're ${absoluteDiff.toFixed(1)} hours ahead of me!`
        setTimeDiff(diffText)
      }
      
      // User's local time and date
      const userOptions: Intl.DateTimeFormatOptions = { 
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        fractionalSecondDigits: 3
      }
      const userDateOptions: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }
      setUserTime(now.toLocaleTimeString('en-US', userOptions))
      setUserDate(now.toLocaleDateString('en-US', userDateOptions))
      
      // India (Mumbai) time and date
      const indiaOptions: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Kolkata',
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        fractionalSecondDigits: 3
      }
      const indiaDateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        month: "short",
        day: "2-digit",
        year: "numeric"
      }
      setIndiaTime(now.toLocaleTimeString('en-US', indiaOptions))
      setIndiaDate(now.toLocaleDateString('en-US', indiaDateOptions))
    }

    updateTime()
    // Update every 10ms to ensure smooth milliseconds display
    const interval = setInterval(updateTime, 10)
    return () => clearInterval(interval)
  }, [])

  const textColorClass = isDrawing ? 'text-blue-600' : 'text-white'

  return (
    <div className="flex flex-col max-w-[200px] sm:max-w-none">
      <div className={`font-sans text-xs sm:text-sm ${textColorClass}`}>
        <div className="sm:flex sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span>your time: <span className="font-mono tabular-nums">{userTime}</span></span>
            <span className={`sm:ml-2 ${isDrawing ? 'text-blue-600/75' : 'text-white/75'}`}>{userDate}</span>
          </div>
        </div>
      </div>
      <div className={`font-sans text-xs sm:text-sm mt-1 ${textColorClass}`}>
        <div className="sm:flex sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span>my time: <span className="font-mono tabular-nums">{indiaTime}</span></span>
            <span className={`sm:ml-2 ${isDrawing ? 'text-blue-600/75' : 'text-white/75'}`}>{indiaDate}</span>
          </div>
        </div>
      </div>
      <div className={`font-sans text-xs sm:text-sm mt-2 italic ${isDrawing ? 'text-blue-600/60' : 'text-white/60'}`}>
        {timeDiff}
      </div>
    </div>
  )
} 