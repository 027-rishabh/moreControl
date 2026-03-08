import { motion, type SpringOptions } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  from?: number
  duration?: number
  springOptions?: SpringOptions
  formatFn?: (value: number) => string
  className?: string
}

export function AnimatedNumber({
  value,
  from = 0,
  duration = 0.5,
  springOptions = { bounce: 0 },
  formatFn,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(from)
  const prevValue = useRef(from)

  useEffect(() => {
    if (value === prevValue.current) return

    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)

      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      const currentValue = from + (value - from) * eased

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
        prevValue.current = value
      }
    }

    requestAnimationFrame(animate)
  }, [value, from, duration])

  return (
    <span className={className}>
      {formatFn ? formatFn(displayValue) : Math.round(displayValue)}
    </span>
  )
}

export function AnimatedValue({
  value,
  from = 0,
  duration = 0.5,
  formatFn,
  className,
}: AnimatedNumberProps) {
  const [animatedValue, setAnimatedValue] = useState(from)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <AnimatedNumber
      value={animatedValue}
      from={from}
      duration={duration}
      formatFn={formatFn}
      className={className}
    />
  )
}
