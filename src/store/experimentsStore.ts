import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Experiment {
  id: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number
  status: 'draft' | 'running' | 'completed' | 'paused'
  variants: {
    name: string
    percentage: number
  }[]
  metrics: {
    conversions: number
    impressions: number
  }
}

interface ExperimentsState {
  experiments: Experiment[]
  toggleExperiment: (id: string) => void
  updateRollout: (id: string, percentage: number) => void
  addExperiment: (experiment: Omit<Experiment, 'id' | 'metrics'>) => void
  deleteExperiment: (id: string) => void
}

const initialExperiments: Experiment[] = [
  {
    id: 'exp-1',
    name: 'New Checkout Flow',
    description: 'Redesigned checkout experience with fewer steps',
    enabled: true,
    rolloutPercentage: 50,
    status: 'running',
    variants: [
      { name: 'Control', percentage: 50 },
      { name: 'Variant A', percentage: 50 },
    ],
    metrics: { conversions: 1247, impressions: 8934 },
  },
  {
    id: 'exp-2',
    name: 'Dark Mode Default',
    description: 'Enable dark mode by default for new users',
    enabled: true,
    rolloutPercentage: 75,
    status: 'running',
    variants: [
      { name: 'Light Default', percentage: 25 },
      { name: 'Dark Default', percentage: 75 },
    ],
    metrics: { conversions: 3421, impressions: 12453 },
  },
  {
    id: 'exp-3',
    name: 'Pricing Page Redesign',
    description: 'New pricing tiers and visual hierarchy',
    enabled: false,
    rolloutPercentage: 0,
    status: 'draft',
    variants: [
      { name: 'Current', percentage: 100 },
      { name: 'Redesign', percentage: 0 },
    ],
    metrics: { conversions: 0, impressions: 0 },
  },
  {
    id: 'exp-4',
    name: 'Mobile Navigation',
    description: 'Bottom navigation bar for mobile users',
    enabled: true,
    rolloutPercentage: 30,
    status: 'running',
    variants: [
      { name: 'Top Nav', percentage: 70 },
      { name: 'Bottom Nav', percentage: 30 },
    ],
    metrics: { conversions: 892, impressions: 5621 },
  },
]

export const useExperimentsStore = create<ExperimentsState>()(
  persist(
    (set) => ({
      experiments: initialExperiments,
      toggleExperiment: (id) =>
        set((state) => ({
          experiments: state.experiments.map((exp) =>
            exp.id === id
              ? {
                  ...exp,
                  enabled: !exp.enabled,
                  status: !exp.enabled ? 'running' : 'paused',
                }
              : exp
          ),
        })),
      updateRollout: (id, percentage) =>
        set((state) => ({
          experiments: state.experiments.map((exp) =>
            exp.id === id
              ? {
                  ...exp,
                  rolloutPercentage: percentage,
                  variants: [
                    { name: exp.variants[0].name, percentage: 100 - percentage },
                    { name: exp.variants[1].name, percentage },
                  ],
                }
              : exp
          ),
        })),
      addExperiment: (experiment) =>
        set((state) => ({
          experiments: [
            ...state.experiments,
            {
              ...experiment,
              id: `exp-${Date.now()}`,
              metrics: { conversions: 0, impressions: 0 },
            },
          ],
        })),
      deleteExperiment: (id) =>
        set((state) => ({
          experiments: state.experiments.filter((exp) => exp.id !== id),
        })),
    }),
    {
      name: 'experiments-storage',
    }
  )
)
