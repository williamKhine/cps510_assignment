import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/auth-button";

export default async function Home() {

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || data?.claims) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <AuthButton />
    </main>
  );
}
