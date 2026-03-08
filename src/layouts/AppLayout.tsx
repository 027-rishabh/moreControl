import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

export function AppLayout() {
  const { theme, actualTheme } = useThemeStore()

  useEffect(() => {
    const effectiveTheme = theme === 'system' ? actualTheme : theme
    document.documentElement.classList.toggle('dark', effectiveTheme === 'dark')
  }, [theme, actualTheme])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
