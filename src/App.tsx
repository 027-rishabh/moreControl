import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { ActivityPage } from '@/pages/ActivityPage'
import { UsersPage } from '@/pages/UsersPage'
import { ExperimentsPage } from '@/pages/ExperimentsPage'
import { ErrorsPage } from '@/pages/ErrorsPage'
import { PerformancePage } from '@/pages/PerformancePage'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { CommandPalette } from '@/components/ui/command-palette'
import { Toaster } from 'sonner'
import { ErrorBoundary } from './ErrorBoundary'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { useEffect } from 'react'

function AppContent() {
  const commandPalette = useCommandPalette()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        commandPalette.toggle()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandPalette.toggle])

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="experiments" element={<ExperimentsPage />} />
          <Route path="errors" element={<ErrorsPage />} />
          <Route path="performance" element={<PerformancePage />} />
        </Route>
      </Routes>
      <CommandPalette open={commandPalette.open} onOpenChange={commandPalette.setOpen} />
      <Toaster richColors position="bottom-right" />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
