import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary">
      <main className="container mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-16 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Helpdesk System
          </h1>
          <p className="text-xl text-muted-foreground">
            CPS510 Final Assignment - Built with Next.js, Supabase & Clerk
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Next.js 16</h3>
            <p className="text-sm text-muted-foreground">
              App Router with TypeScript and Server Components
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Clerk Auth</h3>
            <p className="text-sm text-muted-foreground">
              Complete authentication with sign-in, sign-up, and user management
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Supabase</h3>
            <p className="text-sm text-muted-foreground">
              PostgreSQL database with real-time capabilities
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">shadcn/ui</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful UI components built with Radix UI and Tailwind CSS
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Tailwind CSS</h3>
            <p className="text-sm text-muted-foreground">
              Utility-first CSS framework for rapid UI development
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">TypeScript</h3>
            <p className="text-sm text-muted-foreground">
              Type-safe code with excellent developer experience
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
