import { create } from 'zustand'

export interface ErrorLog {
  id: string
  message: string
  stack?: string
  component?: string
  userCount: number
  occurrences: number
  firstSeen: Date
  lastSeen: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'new' | 'investigating' | 'resolved'
}

interface ErrorsState {
  errors: ErrorLog[]
  addError: (error: Omit<ErrorLog, 'id' | 'firstSeen' | 'lastSeen' | 'occurrences'>) => void
  updateErrorStatus: (id: string, status: ErrorLog['status']) => void
  clearResolved: () => void
}

const generateStack = () => {
  const frames = [
    'at Component.render (webpack:///./src/components/Dashboard.tsx:42:15)',
    'at App (webpack:///./src/App.tsx:28:9)',
    'at Provider (webpack:///./src/context/Provider.tsx:15:3)',
  ]
  return frames.join('\n')
}

const initialErrors: ErrorLog[] = [
  {
    id: 'err-1',
    message: 'TypeError: Cannot read property "map" of undefined',
    stack: generateStack(),
    component: 'UserList',
    userCount: 234,
    occurrences: 1847,
    firstSeen: new Date(Date.now() - 86400000 * 2),
    lastSeen: new Date(Date.now() - 300000),
    severity: 'high',
    status: 'investigating',
  },
  {
    id: 'err-2',
    message: 'Network Error: Failed to fetch /api/metrics',
    component: 'MetricsPanel',
    userCount: 89,
    occurrences: 342,
    firstSeen: new Date(Date.now() - 3600000),
    lastSeen: new Date(Date.now() - 60000),
    severity: 'medium',
    status: 'new',
  },
  {
    id: 'err-3',
    message: 'RangeError: Invalid time value',
    component: 'DateFormatter',
    userCount: 12,
    occurrences: 45,
    firstSeen: new Date(Date.now() - 7200000),
    lastSeen: new Date(Date.now() - 1800000),
    severity: 'low',
    status: 'new',
  },
]

export const useErrorsStore = create<ErrorsState>()((set) => ({
  errors: initialErrors,
  addError: (error) =>
    set((state) => {
      const existingError = state.errors.find(
        (e) => e.message === error.message && e.component === error.component
      )
      if (existingError) {
        return {
          errors: state.errors.map((e) =>
            e.id === existingError.id
              ? {
                  ...e,
                  occurrences: e.occurrences + 1,
                  lastSeen: new Date(),
                  userCount: e.userCount + Math.floor(Math.random() * 5),
                }
              : e
          ),
        }
      }
      return {
        errors: [
          {
            ...error,
            id: `err-${Date.now()}`,
            firstSeen: new Date(),
            lastSeen: new Date(),
            occurrences: 1,
          },
          ...state.errors,
        ],
      }
    }),
  updateErrorStatus: (id, status) =>
    set((state) => ({
      errors: state.errors.map((e) => (e.id === id ? { ...e, status } : e)),
    })),
  clearResolved: () =>
    set((state) => ({
      errors: state.errors.filter((e) => e.status !== 'resolved'),
    })),
}))
