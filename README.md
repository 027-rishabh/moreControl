# moreControl

A modern monitoring dashboard for product teams to track user activity, feature experiments, performance metrics, and errors in real-time.

## Features

### Dashboard
- Real-time metric cards with animated numbers
- Live performance charts
- Activity feed with staggered animations
- Error radar overview

### Live Activity Feed
- Real-time streaming events simulation
- Multiple event types (signups, checkouts, deploys, errors, features)
- Auto-updating timestamps

### User Session Explorer
- 10,000 generated users with efficient pagination
- Advanced filtering and search
- Sortable columns

### Feature Experiment Lab
- Toggle feature flags
- Adjust rollout percentages
- A/B test variant management
- Conversion rate tracking

### Error Radar
- Expandable error details
- Stack trace preview
- Severity levels and status tracking

### Performance Observatory
- Real-time performance metrics
- Render time and network latency tracking
- Bundle size monitoring
- FPS tracking

## Tech Stack

- React 19 with TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- TanStack Query & Table
- Recharts
- React Router

## Installation

```bash
npm install
```

## Running

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open Command Palette |

## Project Structure

```
src/
├── components/ui/     # Reusable UI components
├── features/          # Feature modules
├── hooks/             # Custom hooks
├── layouts/           # Layout components
├── pages/             # Page components
├── services/          # API & data generation
├── store/             # State management
├── styles/            # Global styles
└── utils/             # Utilities
```

## Deployment

### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to gh-pages branch:
   ```bash
   npx gh-pages -d dist
   ```

3. On GitHub, go to Settings → Pages and select:
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

## License

MIT
