import { ActivityFeed } from '@/features/activity/ActivityFeed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'

export function ActivityPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Activity Feed</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time stream of user actions and system events
        </p>
      </motion.div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <ActivityFeed />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
