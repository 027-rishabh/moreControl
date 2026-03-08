import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/utils'
import {
  LayoutDashboard,
  Activity,
  Users,
  FlaskConical,
  AlertTriangle,
  Gauge,
  Moon,
  Sun,
} from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Activity', path: '/activity' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: FlaskConical, label: 'Experiments', path: '/experiments' },
  { icon: AlertTriangle, label: 'Errors', path: '/errors' },
  { icon: Gauge, label: 'Performance', path: '/performance' },
]

export function Sidebar() {
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-card transition-colors duration-300">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">moreControl</span>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="text-xs font-medium">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
