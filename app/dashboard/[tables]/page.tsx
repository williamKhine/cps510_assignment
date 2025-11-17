import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TableSearch from "@/components/table-search";

export default async function TablePage({ params }: { params: Promise<{ tables: string }> }) {
  const { tables } = await params;
  const table_name = tables.charAt(0).toUpperCase() + tables.slice(1);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // fetch one row to infer field names for the client search component
  const { data: sampleData, error: sampleError } = await supabase.from(tables).select("*").limit(1);
  if (sampleError) {
    return <div className="p-6">Error loading table data: {sampleError.message}</div>;
  }

  const fields = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [];

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-4">{table_name} Data</h2>
      <TableSearch table={tables} fields={fields} />
    </div>
  );
}