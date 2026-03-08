import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Gauge, Clock, Package, Activity } from 'lucide-react'
import { generatePerformanceData } from '@/services/dataGenerator'
import { AnimatedValue } from '@/components/ui/animated-number'

interface PerformanceData {
  timestamp: Date
  renderTime: number
  networkLatency: number
  bundleSize: number
  fps: number
}

export function PerformanceObservatory() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [current, setCurrent] = useState<PerformanceData | null>(null)

  useEffect(() => {
    // Initial data
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      ...generatePerformanceData(),
      timestamp: new Date(Date.now() - (29 - i) * 60000),
    }))
    setData(initialData)
    setCurrent(initialData[initialData.length - 1])

    // Update every 3 seconds
    const interval = setInterval(() => {
      const newData = generatePerformanceData()
      setData((prev) => [...prev.slice(1), newData])
      setCurrent(newData)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const avgRenderTime =
    data.length > 0
      ? data.reduce((acc, d) => acc + d.renderTime, 0) / data.length
      : 0

  const avgLatency =
    data.length > 0
      ? data.reduce((acc, d) => acc + d.networkLatency, 0) / data.length
      : 0

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Performance Observatory
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time performance metrics and insights
        </p>
      </motion.div>

      {/* Current Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Render Time
              </CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {current && (
                  <AnimatedValue
                    value={current.renderTime}
                    duration={0.5}
                    formatFn={(v) => `${v.toFixed(1)} ms`}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: {avgRenderTime.toFixed(1)} ms
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Network Latency
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {current && (
                  <AnimatedValue
                    value={current.networkLatency}
                    duration={0.5}
                    formatFn={(v) => `${v.toFixed(0)} ms`}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: {avgLatency.toFixed(0)} ms
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bundle Size
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {current && (
                  <AnimatedValue
                    value={current.bundleSize}
                    duration={0.5}
                    formatFn={(v) => `${v.toFixed(2)} MB`}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Main bundle
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Frame Rate
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {current && (
                  <AnimatedValue
                    value={current.fps}
                    duration={0.5}
                    formatFn={(v) => `${v} FPS`}
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {current && current.fps >= 60 ? 'Excellent' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Render Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                />
                <Line
                  type="monotone"
                  dataKey="renderTime"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  name="Render Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Latency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(t) => new Date(t).toLocaleTimeString()}
                />
                <Bar
                  dataKey="networkLatency"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  name="Latency (ms)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
