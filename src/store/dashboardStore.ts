import { create } from 'zustand'

export interface MetricCard {
  id: string
  title: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: string
}

export interface Widget {
  id: string
  type: string
  title: string
  position: { x: number; y: number }
  size: { w: number; h: number }
  enabled: boolean
}

interface DashboardState {
  metrics: MetricCard[]
  widgets: Widget[]
  updateMetric: (id: string, value: number) => void
  updateMetrics: (metrics: Partial<MetricCard>[]) => void
  moveWidget: (id: string, position: { x: number; y: number }) => void
  toggleWidget: (id: string) => void
}

const initialMetrics: MetricCard[] = [
  {
    id: 'active-users',
    title: 'Active Users',
    value: 2847,
    change: 12.5,
    trend: 'up',
    icon: 'users',
  },
  {
    id: 'deployment-status',
    title: 'Deployment Status',
    value: 98.2,
    change: 0.8,
    trend: 'up',
    icon: 'check-circle',
  },
  {
    id: 'error-rate',
    title: 'Error Rate',
    value: 0.12,
    change: -0.05,
    trend: 'down',
    icon: 'alert-triangle',
  },
  {
    id: 'experiments',
    title: 'Experiments Running',
    value: 12,
    change: 3,
    trend: 'up',
    icon: 'flask-conical',
  },
  {
    id: 'api-latency',
    title: 'API Latency (ms)',
    value: 142,
    change: -18,
    trend: 'down',
    icon: 'zap',
  },
]

const initialWidgets: Widget[] = [
  { id: 'w1', type: 'metrics', title: 'Key Metrics', position: { x: 0, y: 0 }, size: { w: 2, h: 1 }, enabled: true },
  { id: 'w2', type: 'activity', title: 'Live Activity', position: { x: 2, y: 0 }, size: { w: 2, h: 2 }, enabled: true },
  { id: 'w3', type: 'errors', title: 'Error Radar', position: { x: 0, y: 1 }, size: { w: 2, h: 2 }, enabled: true },
  { id: 'w4', type: 'performance', title: 'Performance', position: { x: 4, y: 0 }, size: { w: 2, h: 2 }, enabled: true },
]

export const useDashboardStore = create<DashboardState>()((set) => ({
  metrics: initialMetrics,
  widgets: initialWidgets,
  updateMetric: (id, value) =>
    set((state) => ({
      metrics: state.metrics.map((m) =>
        m.id === id
          ? {
              ...m,
              value,
              trend: value > m.value ? 'up' : value < m.value ? 'down' : 'neutral',
              change: ((value - m.value) / m.value) * 100,
            }
          : m
      ),
    })),
  updateMetrics: (updates) =>
    set((state) => ({
      metrics: state.metrics.map((m) => {
        const update = updates.find((u) => u.id === m.id)
        return update ? { ...m, ...update } : m
      }),
    })),
  moveWidget: (id, position) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    })),
  toggleWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, enabled: !w.enabled } : w
      ),
    })),
}))
