import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedValue } from '@/components/ui/animated-number'
import { TrendingUp, TrendingDown, Minus, Users, CheckCircle, AlertTriangle, FlaskConical, Zap } from 'lucide-react'
import { cn } from '@/utils'
import type { MetricCard as MetricCardType } from '@/store/dashboardStore'

interface MetricCardProps {
  metric: MetricCardType
  index?: number
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'flask-conical': FlaskConical,
  zap: Zap,
}

export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const IconComponent = iconMap[metric.icon] || Users

  const trendIcon =
    metric.trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : metric.trend === 'down' ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : (
      <Minus className="h-4 w-4 text-muted-foreground" />
    )

  const trendColor =
    metric.trend === 'up'
      ? 'text-green-500'
      : metric.trend === 'down'
      ? 'text-red-500'
      : 'text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group"
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.title}
          </CardTitle>
          <IconComponent className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            <AnimatedValue
              value={metric.value}
              duration={0.8}
              formatFn={(val) =>
                metric.id === 'error-rate' || metric.id === 'deployment-status'
                  ? val.toFixed(2)
                  : metric.id === 'api-latency'
                  ? val.toFixed(0)
                  : val.toLocaleString()
              }
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs">
            {trendIcon}
            <span className={cn('font-medium', trendColor)}>
              {metric.change > 0 ? '+' : ''}
              {metric.change.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">
              {metric.trend === 'up' ? 'increase' : metric.trend === 'down' ? 'decrease' : 'no change'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
