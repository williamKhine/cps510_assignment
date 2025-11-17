"use client"

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  table: string;
  fields?: string[];
};

export default function TableSearch({ table, fields: initialFields }: Props) {
  const [results, setResults] = useState<any[] | null>(null);
  const [fields, setFields] = useState<string[]>(initialFields || []);
  const [query, setQuery] = useState("");
  const [field, setField] = useState<string>(initialFields && initialFields.length > 0 ? initialFields[0] : "All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If fields weren't provided, fetch one row to infer fields
    async function inferFields() {
      if (initialFields && initialFields.length > 0) return;
      const supabase = createClient();
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        setError(error.message);
        return;
      }
      const inferred = data && data.length > 0 ? Object.keys(data[0]) : [];
      setFields(inferred);
      if (inferred.length > 0) setField(inferred[0]);
    }
    inferFields();
  }, [initialFields, table]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.from(table).select("*");
    setLoading(false);
    if (error) return setError(error.message);
    setResults(data as any[]);
  }

  async function performSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    try {
      if (!query) {
        const { data, error } = await supabase.from(table).select("*");
        if (error) throw error;
        setResults(data as any[]);
      } else {
        // if field is All, build an OR expression across all fields we know
        if (field === "All") {
          if (!fields || fields.length === 0) {
            // fallback to fetch all
            const { data, error } = await supabase.from(table).select("*");
            if (error) throw error;
            setResults(data as any[]);
          } else {
            const orExpr = fields.map((f) => `${f}.ilike.%${query}%`).join(",");
            const { data, error } = await supabase.from(table).select("*").or(orExpr);
            if (error) throw error;
            setResults(data as any[]);
          }
        } else {
          const { data, error } = await supabase.from(table).select("*").ilike(field, `%${query}%` as any);
          if (error) throw error;
          setResults(data as any[]);
        }
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // fetch initial data
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return (
    <div className="p-4">
      <div className="mb-4 border rounded-md p-3 bg-white/50">
        <form onSubmit={performSearch} className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="max-w-lg"
          />

          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className={cn(
              "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            )}
          >
            <option value="All">All</option>
            {fields.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <Button type="submit" size="sm">
            {loading ? "Searching..." : "Search"}
          </Button>

          <Button variant="ghost" size="sm" type="button" onClick={() => { setQuery(""); fetchAll(); }}>
            Reset
          </Button>
        </form>
      </div>

      {error && <div className="text-red-600">Error: {error}</div>}

      <Table>
        <TableCaption>{table} results</TableCaption>
        <TableHeader>
          <TableRow>
            {results && results.length > 0 ? (
              Object.keys(results[0]).map((key) => (
                <TableHead key={key}>{key}</TableHead>
              ))
            ) : (
              <TableHead>No Data</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results && results.length > 0 ? (
            results.map((row: any, index: number) => (
              <TableRow key={index}>
                {Object.values(row).map((value: any, idx: number) => (
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
    </div>
  );
}
