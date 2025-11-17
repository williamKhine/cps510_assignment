import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function TablePage({ params }: { params: Promise<{ tables: string }> }) {
  const { tables } = await params;
  const table_name = tables.charAt(0).toUpperCase() + tables.slice(1);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: tableData, error: tableError } = await supabase.from(tables).select("*");
  if (tableError) {
    return <div className="p-6">Error loading table data: {tableError.message}</div>;
  }

  return (
    <Table>
      <TableCaption>{table_name} Data</TableCaption>
      <TableHeader>
        <TableRow>
          {tableData && tableData.length > 0 ? (
            Object.keys(tableData[0]).map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))
          ) : (
            <TableHead>No Data</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData && tableData.length > 0 ? (
          tableData.map((row: any, index: number) => (
            <TableRow key={index}>
              {Object.values(row).map((value, idx) => (
                <TableCell key={idx}>{String(value)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={1}>No data available</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}