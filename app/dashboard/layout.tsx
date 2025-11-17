import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const tables = ["Emails","Teams", "Users", "Agents", "Tickets", "Messages", "Issues", "Reports", "Solutions"];

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-2 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-xl">Helpdesk System</Link>
            </div>

              {tables.map((table) => (
                <NavigationMenu key={table}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href={`/dashboard/${table.toLowerCase()}`}>{table}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ))}
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-5 max-w-5xl p-5">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
          <p>
            Made by{" "}
            <Link
              href="/dashboard/group11"
              // target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Group 11
            </Link>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
