import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { motion } from 'framer-motion'
import { generatePerformanceData } from '@/services/dataGenerator'

export function PerformanceChart() {
  const [data, setData] = useState<
    Array<{ timestamp: Date; renderTime: number; networkLatency: number }>
  >([])

  useEffect(() => {
    // Initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      ...generatePerformanceData(),
      timestamp: new Date(Date.now() - (19 - i) * 60000),
    }))
    setData(initialData)

    // Update every 5 seconds
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), generatePerformanceData()]
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRender" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="renderTime"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorRender)"
                strokeWidth={2}
                name="Render Time (ms)"
              />
              <Area
                type="monotone"
                dataKey="networkLatency"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorNetwork)"
                strokeWidth={2}
                name="Network (ms)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
