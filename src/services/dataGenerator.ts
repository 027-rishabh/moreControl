import { faker } from '@faker-js/faker'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  location: string
  device: string
  browser: string
  os: string
  sessionTime: number
  status: 'active' | 'idle' | 'offline'
  lastActive: Date
  plan: 'free' | 'pro' | 'enterprise'
}

export function generateUser(): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  
  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    avatar: faker.image.avatarGitHub(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
    browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
    os: faker.helpers.arrayElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
    sessionTime: faker.number.int({ min: 1, max: 7200 }),
    status: faker.helpers.arrayElement(['active', 'idle', 'offline'] as const),
    lastActive: faker.date.recent({ days: 1 }),
    plan: faker.helpers.weightedArrayElement([
      { weight: 60, value: 'free' },
      { weight: 30, value: 'pro' },
      { weight: 10, value: 'enterprise' },
    ] as const),
  }
}

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateUser())
}

export interface PerformanceData {
  timestamp: Date
  renderTime: number
  networkLatency: number
  bundleSize: number
  fps: number
}

export function generatePerformanceData(): PerformanceData {
  return {
    timestamp: new Date(),
    renderTime: faker.number.float({ min: 8, max: 45, fractionDigits: 1 }),
    networkLatency: faker.number.float({ min: 20, max: 200, fractionDigits: 0 }),
    bundleSize: faker.number.float({ min: 1.2, max: 2.8, fractionDigits: 2 }),
    fps: faker.number.int({ min: 55, max: 60 }),
  }
}

export function generateActivityEvent() {
  const eventTypes = [
    {
      type: 'signup' as const,
      titles: ['New user signed up', 'Trial account created', 'Enterprise signup'],
      descriptions: [
        'via Google OAuth',
        'with email verification',
        'from marketing campaign',
      ],
    },
    {
      type: 'checkout' as const,
      titles: ['Checkout completed', 'Subscription upgraded', 'Payment processed'],
      descriptions: [
        'Pro plan - $29/month',
        'Enterprise plan - $99/month',
        'Annual subscription',
      ],
    },
    {
      type: 'deploy' as const,
      titles: ['Deployment triggered', 'Build completed', 'Release published'],
      descriptions: [
        'Production deployment',
        'Staging environment',
        'Hotfix deployed',
      ],
    },
    {
      type: 'error' as const,
      titles: ['Error detected', 'Exception caught', 'API failure'],
      descriptions: [
        'In user dashboard',
        'During checkout flow',
        'In analytics module',
      ],
    },
    {
      type: 'feature' as const,
      titles: ['Feature flag changed', 'Experiment updated', 'A/B test modified'],
      descriptions: [
        'Rollout increased to 75%',
        'Variant B disabled',
        'New cohort added',
      ],
    },
  ]

  const category = faker.helpers.arrayElement(eventTypes)
  
  return {
    type: category.type,
    title: faker.helpers.arrayElement(category.titles),
    description: faker.helpers.arrayElement(category.descriptions),
    user: faker.person.fullName(),
  }
}
