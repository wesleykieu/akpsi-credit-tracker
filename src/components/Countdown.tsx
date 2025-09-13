"use client"

import React from "react"

type CountdownProps = {
  target: string | Date
  className?: string
}

function getTimeParts(diffMs: number) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

export default function Countdown({ target, className }: CountdownProps) {
  const targetTime = React.useMemo(() => new Date(target).getTime(), [target])
  const [now, setNow] = React.useState<number>(0)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) {
    return (
      <div className={className} aria-live="polite" aria-label="Countdown timer">
        <div className="grid grid-cols-4 gap-2 col-span-4">
          <TimeBox value={0} label="Days" />
          <TimeBox value={0} label="Hours" />
          <TimeBox value={0} label="Minutes" />
          <TimeBox value={0} label="Seconds" />
        </div>
      </div>
    )
  }

  const remaining = Math.max(0, targetTime - now)
  const { days, hours, minutes, seconds } = getTimeParts(remaining)

  return (
    <div className={className} aria-live="polite" aria-label="Countdown timer">
      <div className="grid grid-cols-4 gap-2 col-span-4">
        <TimeBox value={days} label="Days" />
        <TimeBox value={hours} label="Hours" />
        <TimeBox value={minutes} label="Minutes" />
        <TimeBox value={seconds} label="Seconds" />
      </div>
    </div>
  )
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border bg-card/40 p-2 text-center shadow-sm min-w-[60px] flex flex-col justify-center">
      <div className="text-2xl font-semibold leading-none mb-2">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">
        {label}
      </div>
    </div>
  )
}


