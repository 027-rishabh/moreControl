import { useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboardStore'
import { MetricCard } from './MetricCard'
import { PerformanceChart } from './PerformanceChart'
import { ActivityFeed } from '@/features/activity/ActivityFeed'
import { ErrorList } from '@/features/errors/ErrorList'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { generateActivityEvent } from '@/services/dataGenerator'
import { useActivityStore } from '@/store/activityStore'
import { useErrorsStore } from '@/store/errorsStore'
import { Bell } from 'lucide-react'

export function Dashboard() {
  const { metrics, updateMetric } = useDashboardStore()
  const { addEvent, events } = useActivityStore()
  const { addError } = useErrorsStore()

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      const metricIds = ['active-users', 'api-latency', 'error-rate']
      const randomId = metricIds[Math.floor(Math.random() * metricIds.length)]
      const metric = metrics.find((m) => m.id === randomId)

      if (metric) {
        const variance = metric.id === 'api-latency' ? 20 : metric.id === 'active-users' ? 50 : 0.02
        const newValue = metric.value + (Math.random() - 0.5) * variance
        updateMetric(randomId, Math.max(0, newValue))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [metrics, updateMetric])

  // Simulate activity events - more frequent
  useEffect(() => {
    const eventTypes = ['signup', 'checkout', 'deploy', 'feature', 'session'] as const
    
    const interval = setInterval(() => {
      // 70% chance of new event every 2 seconds
      if (Math.random() > 0.3) {
        const event = generateActivityEvent()
        addEvent(event)
        
        // Occasionally add errors too (10% chance)
        if (Math.random() > 0.9) {
          addError({
            message: `Error: ${['Network timeout', 'Undefined property', 'Failed to fetch', 'Invalid response'][Math.floor(Math.random() * 4)]}`,
            component: ['Dashboard', 'UserList', 'MetricsPanel', 'Checkout'][Math.floor(Math.random() * 4)],
            userCount: Math.floor(Math.random() * 50) + 1,
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
            status: 'new',
          })
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [addEvent, addError])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time monitoring and insights for your product
            </p>
          </div>
          
          {/* Live indicator with event count */}
          <AnimatePresence>
            {events.length > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Bell className="h-5 w-5 text-green-500" />
                <Badge variant="success" className="animate-pulse">
                  {events.length} new {events.length === 1 ? 'event' : 'events'}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart />
        <ActivityFeed limit={8} />
      </div>

      {/* Error Radar */}
      <ErrorList limit={5} />
    </div>
  )
}
