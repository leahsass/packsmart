import React from "react";
import { CloudOff, RefreshCw } from "lucide-react";
import useOfflineSync from "@/hooks/useOfflineSync";

export default function OfflineBanner() {
  const { online, pending } = useOfflineSync();

  if (online && pending === 0) return null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-3">
      <p
        role="status"
        className="flex items-center gap-2 rounded-2xl border border-border bg-muted px-4 py-2 text-xs font-semibold text-foreground"
      >
        {online ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
            Syncing {pending} change{pending === 1 ? "" : "s"}…
          </>
        ) : (
          <>
            <CloudOff className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            Offline — your edits save on this device and sync when you reconnect.
          </>
        )}
      </p>
    </div>
  );
}