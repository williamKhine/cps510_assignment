import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

export default async function DashboardPage() {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')

  let user = null
  if (hasClerkKeys) {
    await auth.protect()
    user = await currentUser()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Helpdesk System</h1>
          {hasClerkKeys && <UserButton />}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {!hasClerkKeys && (
          <div className="mb-6 rounded-lg border border-yellow-500 bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            <p className="font-semibold">⚠️ Clerk is not configured</p>
            <p className="text-sm mt-1">
              Please set up your Clerk API keys in .env.local to enable authentication.
              See README.md for setup instructions.
            </p>
          </div>
        )}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Welcome{hasClerkKeys && user ? `, ${user.firstName || 'User'}` : ''}!
          </h2>
          <p className="text-muted-foreground">
            {hasClerkKeys 
              ? 'This is a protected dashboard page. You are authenticated with Clerk.'
              : 'This is the dashboard page. Configure Clerk to enable authentication.'}
          </p>
          {hasClerkKeys && user && (
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-sm">
                <span className="font-medium">User ID:</span> {user.id}
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Stack Information</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Next.js 16 with App Router</li>
            <li>TypeScript for type safety</li>
            <li>Clerk for authentication</li>
            <li>Supabase for database (configured in lib/supabase.ts)</li>
            <li>shadcn/ui + Tailwind CSS for UI components</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
