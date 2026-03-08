import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useErrorsStore, type ErrorLog } from '@/store/errorsStore'
import { formatTimeAgo } from '@/utils'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react'

interface ErrorListProps {
  limit?: number
}

export function ErrorList({ limit }: ErrorListProps) {
  const { errors, updateErrorStatus } = useErrorsStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const displayedErrors = limit ? errors.slice(0, limit) : errors

  const severityColors: Record<ErrorLog['severity'], 'default' | 'destructive' | 'warning' | 'secondary'> = {
    low: 'secondary',
    medium: 'warning',
    high: 'destructive',
    critical: 'destructive',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Error Radar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {displayedErrors.map((error, index) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="overflow-hidden rounded-lg border transition-colors hover:bg-muted/50"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === error.id ? null : error.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        error.severity === 'critical' || error.severity === 'high'
                          ? 'bg-red-500/20 text-red-500'
                          : error.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-blue-500/20 text-blue-500'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">
                        {error.message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {error.userCount} users
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(error.lastSeen)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Terminal className="h-3 w-3" />
                          {error.component}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={severityColors[error.severity]}>
                      {error.severity}
                    </Badge>
                    <Badge
                      variant={
                        error.status === 'resolved'
                          ? 'success'
                          : error.status === 'investigating'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {error.status}
                    </Badge>
                    {expandedId === error.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === error.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t p-4 space-y-4 bg-muted/30">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Stack Trace
                          </p>
                          <pre className="overflow-x-auto rounded-md bg-black/80 p-3 text-xs text-red-400 font-mono">
                            {error.stack || 'No stack trace available'}
                          </pre>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="rounded-lg bg-card p-3">
                            <p className="text-xs text-muted-foreground">
                              Occurrences
                            </p>
                            <p className="text-lg font-bold">
                              {error.occurrences.toLocaleString()}
                            </p>
                          </div>
                          <div className="rounded-lg bg-card p-3">
                            <p className="text-xs text-muted-foreground">
                              First Seen
                            </p>
                            <p className="text-lg font-bold">
                              {formatTimeAgo(error.firstSeen)}
                            </p>
                          </div>
                          <div className="rounded-lg bg-card p-3">
                            <p className="text-xs text-muted-foreground">
                              Last Seen
                            </p>
                            <p className="text-lg font-bold">
                              {formatTimeAgo(error.lastSeen)}
                            </p>
                          </div>
                        </div>

                        {error.status !== 'resolved' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateErrorStatus(error.id, 'investigating')
                              }
                            >
                              Mark as Investigating
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                updateErrorStatus(error.id, 'resolved')
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark as Resolved
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
