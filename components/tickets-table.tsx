import { createClient } from "@/lib/supabase/server";
import TableSearch from "@/components/table";

export default async function ReadTable() {
  const supabase = await createClient();

  const { data: sampleData, error } = await supabase
    .from("tickets")
    .select("*")
    .limit(1);

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        Error loading table data: {error.message}
      </div>
    );
  }

  const fields =
    sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [];

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-medium">Tickets Data</h2>
      <TableSearch table="tickets" fields={fields} />
    </div>
  );
}
