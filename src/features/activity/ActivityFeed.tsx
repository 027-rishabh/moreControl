import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useActivityStore, type ActivityEvent } from '@/store/activityStore'
import { formatTimeAgo } from '@/utils'
import {
  UserPlus,
  CreditCard,
  Rocket,
  AlertCircle,
  Flag,
  MonitorPlay,
  Zap,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const eventIcons: Record<ActivityEvent['type'], React.ElementType> = {
  signup: UserPlus,
  checkout: CreditCard,
  deploy: Rocket,
  error: AlertCircle,
  feature: Flag,
  session: MonitorPlay,
}

const eventColors: Record<ActivityEvent['type'], 'default' | 'success' | 'warning' | 'destructive'> = {
  signup: 'success',
  checkout: 'success',
  deploy: 'default',
  error: 'destructive',
  feature: 'warning',
  session: 'default',
}

interface ActivityFeedProps {
  limit?: number
}

export function ActivityFeed({ limit }: ActivityFeedProps) {
  const { events } = useActivityStore()
  const displayedEvents = limit ? events.slice(0, limit) : events
  const [prevCount, setPrevCount] = useState(events.length)
  const [showNewIndicator, setShowNewIndicator] = useState(false)

  // Detect new events
  useEffect(() => {
    if (events.length > prevCount) {
      setShowNewIndicator(true)
      const timer = setTimeout(() => setShowNewIndicator(false), 2000)
      return () => clearTimeout(timer)
    }
    setPrevCount(events.length)
  }, [events.length, prevCount])

  return (
    <Card className={showNewIndicator ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-background transition-all' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {/* Pulsing live indicator */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
          </span>
          Live Activity Feed
          
          {/* NEW badge when events arrive */}
          <AnimatePresence>
            {showNewIndicator && (
              <motion.div
                initial={{ scale: 0, x: 10 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 10 }}
              >
                <Badge variant="success" className="ml-2 gap-1">
                  <Zap className="h-3 w-3" />
                  NEW
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <AnimatePresence initial={false}>
            {displayedEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <p className="text-muted-foreground font-medium">Waiting for activity...</p>
                <p className="text-xs text-muted-foreground mt-1">Events will appear here in real-time</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {displayedEvents.map((event, index) => {
                  const Icon = eventIcons[event.type]
                  const color = eventColors[event.type]
                  const isNew = index === 0

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className={`flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50 ${
                        isNew ? 'bg-green-500/5 border-green-500/30' : ''
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 shrink-0 ${
                          color === 'success'
                            ? 'bg-green-500/20 text-green-500'
                            : color === 'destructive'
                            ? 'bg-red-500/20 text-red-500'
                            : color === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <Badge variant={color} className="text-xs shrink-0">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          {event.user && (
                            <>
                              <span>by <span className="font-medium">{event.user}</span></span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatTimeAgo(event.timestamp)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
