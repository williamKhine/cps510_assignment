"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

type Option = {
  id: number;
  label: string;
};

export default function CreateTicketForm() {
  const supabase = createClient();

  // dropdown state
  const [users, setUsers] = useState<Option[]>([]);
  const [agents, setAgents] = useState<Option[]>([]);
  const [refsLoading, setRefsLoading] = useState(true);
  const [refsError, setRefsError] = useState<string | null>(null);

  // selected values (as strings for Radix Select)
  const [userId, setUserId] = useState("");
  const [agentId, setAgentId] = useState(""); // "" = unassigned

  // other ticket fields
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // load users + agents for dropdowns
  useEffect(() => {
    async function loadRefs() {
      setRefsLoading(true);
      setRefsError(null);

      const [
        { data: usersData, error: usersError },
        { data: agentsData, error: agentsError },
      ] = await Promise.all([
        supabase.from("users").select("user_id, email_address"),
        supabase.from("agents").select("agent_id, email_address"),
      ]);

      if (usersError || agentsError) {
        setRefsError(
          usersError?.message ??
            agentsError?.message ??
            "Failed to load reference data."
        );
        setRefsLoading(false);
        return;
      }

      setUsers(
        (usersData ?? []).map((u: any) => ({
          id: u.user_id,
          label: u.name ? `${u.user_id} – ${u.name}` : String(u.user_id),
        }))
      );

      setAgents(
        (agentsData ?? []).map((a: any) => ({
          id: a.agent_id,
          label: a.name ? `${a.agent_id} – ${a.name}` : String(a.agent_id),
        }))
      );

      setRefsLoading(false);
    }

    loadRefs();
  }, [supabase]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!userId) {
      setErrorMsg("User is required.");
      setSubmitting(false);
      return;
    }

    const user_id_num = Number(userId);
    const agent_id_num = agentId ? Number(agentId) : null;

    if (Number.isNaN(user_id_num)) {
      setErrorMsg("Selected user_id is invalid.");
      setSubmitting(false);
      return;
    }

    if (agentId && Number.isNaN(agent_id_num)) {
      setErrorMsg("Selected agent_id is invalid.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("tickets").insert({
      user_id: user_id_num,
      agent_id: agent_id_num,
      priority,
      status,
      description: description.trim() || null,
      // ticket_id & date_created handled by DB
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Ticket created successfully.");
      setUserId("");
      setAgentId("");
      setPriority("Medium");
      setStatus("Open");
      setDescription("");
    }

    setSubmitting(false);
  }

  const disableSubmit = submitting || refsLoading || !users.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm text-black"
    >
      <h2 className="mb-2 text-lg font-semibold">Create New Ticket</h2>

      {/* Reference loading / error */}
      {refsLoading && (
        <p className="text-sm text-gray-500">Loading users and agents…</p>
      )}
      {refsError && (
        <p className="text-sm text-red-600">
          Failed to load users/agents: {refsError}
        </p>
      )}

      {/* User (required) */}
      <div className="space-y-1">
        <Label.Root className="text-sm font-medium text-gray-800">
          User <span className="text-red-500">*</span>
        </Label.Root>

        <Select.Root
          value={userId}
          onValueChange={setUserId}
          disabled={refsLoading || !users.length}
        >
          <Select.Trigger
            className="inline-flex w-full items-center justify-between rounded border px-3 py-2 text-sm disabled:bg-gray-100"
            aria-label="User"
          >
            <Select.Value
              placeholder={
                refsLoading
                  ? "Loading users…"
                  : users.length
                  ? "Select a user"
                  : "No users found"
              }
            />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-md border bg-white shadow-lg">
              <Select.ScrollUpButton className="flex items-center justify-center py-1">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.label}
                  </SelectItem>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center py-1">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <p className="text-xs text-gray-500">
          Only IDs that exist in <code>users</code> are shown.
        </p>
      </div>

      {/* Agent (optional) */}
      <div className="space-y-1">
        <Label.Root className="text-sm font-medium text-gray-800">
          Agent (optional)
        </Label.Root>

        <Select.Root
          value={agentId}
          onValueChange={setAgentId}
          disabled={refsLoading || !agents.length}
        >
          <Select.Trigger
            className="inline-flex w-full items-center justify-between rounded border px-3 py-2 text-sm disabled:bg-gray-100"
            aria-label="Agent"
          >
            <Select.Value
              placeholder={
                refsLoading
                  ? "Loading agents…"
                  : agents.length
                  ? "Unassigned"
                  : "No agents found"
              }
            />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-md border bg-white shadow-lg">
              <Select.ScrollUpButton className="flex items-center justify-center py-1">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                <SelectItem value="none">Unassigned</SelectItem>
                {agents.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.label}
                  </SelectItem>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center py-1">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <p className="text-xs text-gray-500">
          Only IDs that exist in <code>agents</code> are shown. Leave as
          &quot;Unassigned&quot; if no agent yet.
        </p>
      </div>

      {/* Priority */}
      <div className="space-y-1">
        <Label.Root className="text-sm font-medium text-gray-800">
          Priority
        </Label.Root>

        <Select.Root value={priority} onValueChange={setPriority}>
          <Select.Trigger
            className="inline-flex w-full items-center justify-between rounded border px-3 py-2 text-sm"
            aria-label="Priority"
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-md border bg-white shadow-lg">
              <Select.ScrollUpButton className="flex items-center justify-center py-1">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center py-1">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Status */}
      <div className="space-y-1">
        <Label.Root className="text-sm font-medium text-gray-800">
          Status
        </Label.Root>

        <Select.Root value={status} onValueChange={setStatus}>
          <Select.Trigger
            className="inline-flex w-full items-center justify-between rounded border px-3 py-2 text-sm"
            aria-label="Status"
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-md border bg-white shadow-lg">
              <Select.ScrollUpButton className="flex items-center justify-center py-1">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center py-1">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label.Root
          htmlFor="description"
          className="text-sm font-medium text-gray-800"
        >
          Description
        </Label.Root>
        <textarea
          id="description"
          className="w-full rounded border px-3 py-2 text-sm"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
        />
      </div>

      {/* Messages */}
      {errorMsg && (
        <p className="text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}
      {successMsg && (
        <p className="text-sm text-green-600" role="status">
          {successMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={disableSubmit}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Creating..." : "Create Ticket"}
      </button>
    </form>
  );
}

function SelectItem(props: Select.SelectItemProps) {
  const { children, ...itemProps } = props;
  return (
    <Select.Item
      {...itemProps}
      className="relative flex w-full cursor-pointer select-none items-center rounded px-3 py-1.5 text-sm text-gray-800 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2 flex items-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}
