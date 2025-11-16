# Helpdesk System

**CPS510-F2025 Final Assignment**

A modern helpdesk system built with Next.js, Supabase, Clerk authentication, and shadcn/ui components.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Clerk account (for authentication)
- Supabase account (for database)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/williamKhine/cps510_assignment.git
cd cps510_assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

#### Clerk Configuration
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your publishable key and secret key
4. Update these variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   ```

#### Supabase Configuration
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Go to Settings > API
4. Copy your project URL and anon/public key
5. Update these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
cps510_assignment/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── sign-in/           # Clerk sign-in page
│   ├── sign-up/           # Clerk sign-up page
│   ├── layout.tsx         # Root layout with ClerkProvider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── utils.ts           # Utility functions (cn helper)
├── middleware.ts          # Clerk authentication middleware
└── .env.example           # Environment variables template
```

## 🔐 Authentication

This project uses Clerk for authentication:

- **Public Routes**: `/`, `/sign-in`, `/sign-up`
- **Protected Routes**: `/dashboard` and any other routes (requires authentication)

The middleware automatically protects all routes except the public ones listed above.

## 🗄️ Database

Supabase is configured and ready to use. The client is available at `lib/supabase.ts`:

```typescript
import { supabase } from '@/lib/supabase'

// Example: Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

## 🎨 UI Components

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables from `.env.example` in your deployment platform.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
