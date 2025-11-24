"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // client-side supabase
import * as Dialog from "@radix-ui/react-dialog";

type TableSearchProps = {
  table: string; // here you'll pass "tickets"
  fields: string[];
};

export default function TableSearch({ table, fields }: TableSearchProps) {
  const supabase = createClient();

  const [rows, setRows] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // initial load of table data
  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase.from(table).select("*");

      if (error) {
        setErrorMsg(error.message);
        setRows([]);
      } else {
        setRows(data ?? []);
      }

      setLoading(false);
    }

    load();
  }, [table]);

  const filteredRows = rows.filter((row) =>
    query.trim() === ""
      ? true
      : fields.some((field) => {
          const value = row[field];
          return value
            ? String(value).toLowerCase().includes(query.toLowerCase())
            : false;
        })
  );

  // open modal for a row
  const handleOpenEdit = (row: any) => {
    setSelectedRow(row);
    setEditValues(row); // start with current values
    setSaveError(null);
    setEditOpen(true);
  };

  // handle input change (except for ticket_id)
  const handleFieldChange = (field: string, value: string) => {
    if (field === "ticket_id") return; // never allow changing PK
    setEditValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedRow || selectedRow.ticket_id == null) {
      setSaveError("Missing ticket_id; cannot update this row.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    // Only updating tickets table here, but this works generically
    const { data, error } = await supabase
      .from(table)
      .update(editValues)
      .eq("ticket_id", selectedRow.ticket_id)
      .select("*")
      .single();

    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }

    // Update local rows state with the updated row
    setRows((prev) =>
      prev.map((row) => (row.ticket_id === selectedRow.ticket_id ? data : row))
    );

    setSaving(false);
    setEditOpen(false);
    setSelectedRow(null);
  };

  if (loading) return <div className="p-4 text-sm">Loading…</div>;

  if (errorMsg)
    return (
      <div className="p-4 text-sm text-red-600">
        Error loading data: {errorMsg}
      </div>
    );

  if (rows.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-600">
        No rows found in <span className="font-mono">{table}</span>.
      </div>
    );
  }

  return (
    <>
      {/* Search box */}
      <input
        className="mb-4 block w-64 rounded border px-3 py-2 text-sm"
        placeholder={`Search ${table}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              {fields.map((field) => (
                <th
                  key={field}
                  className="border-b px-3 py-2 text-left font-semibold text-gray-700"
                >
                  {field}
                </th>
              ))}
              <th className="border-b px-3 py-2 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.ticket_id ?? row.id ?? JSON.stringify(row)}>
                {fields.map((field) => (
                  <td key={field} className="border-b px-3 py-2 align-top">
                    {row[field] != null ? String(row[field]) : "—"}
                  </td>
                ))}

                <td className="border-b px-3 py-2 align-top">
                  <button
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    onClick={() => handleOpenEdit(row)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      <Dialog.Root
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setSelectedRow(null);
            setSaveError(null);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg text-black focus:outline-none">
            <Dialog.Title className="text-lg font-semibold">
              Edit Ticket
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-gray-500">
              Update fields below and click Save to persist changes.
            </Dialog.Description>

            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
              {fields.map((field) => (
                <div key={field}>
                  <p className="mb-1 text-xs font-semibold text-gray-600">
                    {field}
                  </p>
                  <input
                    className={`w-full rounded border px-3 py-1.5 text-sm ${
                      field === "ticket_id"
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-50"
                    }`}
                    readOnly={field === "ticket_id"}
                    disabled={field === "ticket_id"}
                    value={
                      editValues[field] != null ? String(editValues[field]) : ""
                    }
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {saveError && (
              <p className="mt-3 text-xs text-red-600">{saveError}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300">
                  Cancel
                </button>
              </Dialog.Close>

              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
