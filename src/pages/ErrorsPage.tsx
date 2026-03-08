import { ErrorList } from '@/features/errors/ErrorList'
import { motion } from 'framer-motion'

export function ErrorsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Error Radar</h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage frontend errors in real-time
        </p>
      </motion.div>
      <ErrorList />
    </div>
  )
}
