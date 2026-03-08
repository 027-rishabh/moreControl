import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Activity,
  Users,
  FlaskConical,
  AlertTriangle,
  Gauge,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

const navCommands = [
  { icon: LayoutDashboard, label: 'Dashboard', shortcut: 'G D', path: '/' },
  { icon: Activity, label: 'Activity Feed', shortcut: 'G A', path: '/activity' },
  { icon: Users, label: 'User Explorer', shortcut: 'G U', path: '/users' },
  { icon: FlaskConical, label: 'Experiments', shortcut: 'G E', path: '/experiments' },
  { icon: AlertTriangle, label: 'Error Radar', shortcut: 'G R', path: '/errors' },
  { icon: Gauge, label: 'Performance', shortcut: 'G P', path: '/performance' },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { theme, setTheme, actualTheme } = useThemeStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const handleNavClick = (path: string) => {
    navigate(path)
    onOpenChange(false)
  }

  const effectiveTheme = theme === 'system' ? actualTheme : theme

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navCommands.map((cmd) => (
            <CommandItem
              key={cmd.path}
              onSelect={() => handleNavClick(cmd.path)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <cmd.icon className="h-4 w-4 text-muted-foreground" />
                <span>{cmd.label}</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                {cmd.shortcut}
              </kbd>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() => { setTheme('light'); onOpenChange(false) }}
            className="flex items-center gap-3"
          >
            <Sun className="h-4 w-4 text-muted-foreground" />
            <span>Light Theme</span>
            {effectiveTheme === 'light' && theme !== 'system' && (
              <motion.div layoutId="theme-indicator" className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => { setTheme('dark'); onOpenChange(false) }}
            className="flex items-center gap-3"
          >
            <Moon className="h-4 w-4 text-muted-foreground" />
            <span>Dark Theme</span>
            {effectiveTheme === 'dark' && theme !== 'system' && (
              <motion.div layoutId="theme-indicator" className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </CommandItem>
          <CommandItem
            onSelect={() => { setTheme('system'); onOpenChange(false) }}
            className="flex items-center gap-3"
          >
            <Laptop className="h-4 w-4 text-muted-foreground" />
            <span>System</span>
            {theme === 'system' && (
              <motion.div layoutId="theme-indicator" className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
