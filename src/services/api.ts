import { http, HttpResponse, delay } from 'msw'
import { setupWorker } from 'msw/browser'
import { generateUsers, generatePerformanceData, generateActivityEvent } from './dataGenerator'

const users = generateUsers(10000)

export const handlers = [
  http.get('/api/users', async ({ request }) => {
    await delay(100 + Math.random() * 200)

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''

    let filteredUsers = users

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      filteredUsers = filteredUsers.filter((u) => u.status === status)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return HttpResponse.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      totalPages: Math.ceil(filteredUsers.length / limit),
    })
  }),

  http.get('/api/metrics', async () => {
    await delay(50 + Math.random() * 100)

    return HttpResponse.json({
      activeUsers: 2847 + Math.floor(Math.random() * 200 - 100),
      deploymentStatus: 98.2 + Math.random() * 0.5 - 0.25,
      errorRate: 0.12 + Math.random() * 0.02 - 0.01,
      experimentsRunning: 12,
      apiLatency: 142 + Math.floor(Math.random() * 30 - 15),
    })
  }),

  http.get('/api/performance', async () => {
    await delay(50 + Math.random() * 100)

    const data = Array.from({ length: 20 }, (_, i) => ({
      ...generatePerformanceData(),
      timestamp: new Date(Date.now() - (19 - i) * 60000),
    }))

    return HttpResponse.json(data)
  }),

  http.get('/api/activity', async () => {
    await delay(100 + Math.random() * 150)

    const events = Array.from({ length: 20 }, () => ({
      ...generateActivityEvent(),
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(Date.now() - Math.random() * 86400000),
    }))

    return HttpResponse.json(events)
  }),

  http.get('/api/errors', async () => {
    await delay(80 + Math.random() * 120)

    return HttpResponse.json({
      errors: [
        {
          id: '1',
          message: 'TypeError: Cannot read property of undefined',
          count: 234,
          severity: 'high',
        },
        {
          id: '2',
          message: 'Network Error: Request timeout',
          count: 89,
          severity: 'medium',
        },
      ],
    })
  }),
]

export const worker = setupWorker(...handlers)
