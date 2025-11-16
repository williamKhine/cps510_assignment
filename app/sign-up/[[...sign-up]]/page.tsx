import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')

  if (!hasClerkKeys) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sign Up</h1>
            <p className="text-muted-foreground">Clerk authentication is not configured</p>
          </div>
          <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            <p className="font-semibold">⚠️ Setup Required</p>
            <p className="mt-1">
              To enable authentication, please configure your Clerk API keys in .env.local
            </p>
            <p className="mt-2 text-xs">
              See README.md for detailed setup instructions.
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}
