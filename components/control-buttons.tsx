"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function ControlButtons() {

    const supabase = createClient();
    const [isRunning, setIsRunning] = useState(false);
    const [statuses, setStatuses] = useState<{
        drop: 'idle' | 'running' | 'done',
        create: 'idle' | 'running' | 'done',
        populate: 'idle' | 'running' | 'done',
        q1: 'idle' | 'running' | 'done',
        q2: 'idle' | 'running' | 'done',
        q3: 'idle' | 'running' | 'done',
    }>({
        drop: 'idle',
        create: 'idle',
        populate: 'idle',
        q1: 'idle',
        q2: 'idle',
        q3: 'idle',
    });

    const runRpc = async (key: keyof typeof statuses, rpcName: string) => {
        try {
            setIsRunning(true);
            setStatuses(prev => ({ ...prev, [key]: 'running' }));
            const { data, error } = await supabase.rpc(rpcName);
            if (error) {
                console.error(`Error executing ${rpcName}:`, error.message);
            } else {
                console.log(`${rpcName} results:`, data);
            }
        } catch (err) {
            console.error(`Unexpected error running ${rpcName}:`, err);
        } finally {
          setStatuses(prev => ({ ...prev, [key]: 'done' }));
          setIsRunning(false);
          // revert the button label back to idle after 3 seconds
          setTimeout(() => {
            setStatuses(prev => ({ ...prev, [key]: 'idle' }));
          }, 1000);
        }
    }

    const getLabel = (key: keyof typeof statuses, defaultLabel: string) => {
        const s = statuses[key];
        if (s === 'running') return 'Running...';
        if (s === 'done') return 'Done';
        return defaultLabel;
    }

  return (
    <div className="my-auto flex flex-col gap-4 max-w-2xl">
        <Button variant="destructive" onClick={() => runRpc('drop', 'drop_tables')} disabled={isRunning}>
          {getLabel('drop', 'Drop tables')}
        </Button>
        <Button variant="outline" onClick={() => runRpc('create', 'create_tables')} disabled={isRunning}>
          {getLabel('create', 'Create tables')}
        </Button>
        <Button onClick={() => runRpc('populate', 'populate_tables')} disabled={isRunning}>
          {getLabel('populate', 'Populate tables')}
        </Button>
        {/* <Button variant="outline" onClick={() => runRpc('q1', 'query1')} disabled={isRunning}>
          {getLabel('q1', 'Query 1')}
        </Button>
        <Button variant="outline" onClick={() => runRpc('q2', 'query2')} disabled={isRunning}>
          {getLabel('q2', 'Query 2')}
        </Button>
        <Button variant="outline" onClick={() => runRpc('q3', 'query3')} disabled={isRunning}>
          {getLabel('q3', 'Query 3')}
        </Button> */}
    </div>
    );
}