import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ControlButtons } from "@/components/control-buttons";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  
  return (
    <ControlButtons />
  );
}
