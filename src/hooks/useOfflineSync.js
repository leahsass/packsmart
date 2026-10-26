import { useEffect, useState } from "react";
import { flushOutbox, pendingCount } from "@/lib/offline";

export default function useOfflineSync() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [pending, setPending] = useState(() => pendingCount());

  useEffect(() => {
    const refresh = () => {
      setOnline(navigator.onLine);
      setPending(pendingCount());
      if (navigator.onLine) flushOutbox().catch(() => {});
    };
    const onQueued = () => setPending(pendingCount());
    const onSynced = () => setPending(pendingCount());

    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    window.addEventListener("packsmart:queued", onQueued);
    window.addEventListener("packsmart:synced", onSynced);
    refresh();

    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.removeEventListener("packsmart:queued", onQueued);
      window.removeEventListener("packsmart:synced", onSynced);
    };
  }, []);

  return { online, pending };
}