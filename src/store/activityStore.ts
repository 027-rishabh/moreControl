import { create } from 'zustand'

export interface ActivityEvent {
  id: string
  type: 'signup' | 'checkout' | 'deploy' | 'error' | 'feature' | 'session'
  title: string
  description: string
  timestamp: Date
  user?: string
  metadata?: Record<string, unknown>
}

interface ActivityState {
  events: ActivityEvent[]
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void
  clearEvents: () => void
}

export const useActivityStore = create<ActivityState>()((set) => ({
  events: [],
  addEvent: (event) =>
    set((state) => ({
      events: [
        {
          ...event,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
        },
        ...state.events.slice(0, 99),
      ],
    })),
  clearEvents: () => set({ events: [] }),
}))
