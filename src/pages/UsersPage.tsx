import { UserSessionExplorer } from '@/features/users/UserSessionExplorer'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function UsersPage() {
  return (
    <ErrorBoundary
      fallback={
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load users. Please try again.
            </p>
          </CardContent>
        </Card>
      }
    >
      <UserSessionExplorer />
    </ErrorBoundary>
  )
}
