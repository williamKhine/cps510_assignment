import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

export const metadata: Metadata = {
  title: "Helpdesk System",
  description: "CPS510 Final Assignment - Helpdesk System with Next.js, Supabase, and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
  
  if (hasClerkKeys) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className="antialiased">
            {children}
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
