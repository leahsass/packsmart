import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 80;

export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const tracking = useRef(false);

  const onTouchStart = (e) => {
    if (window.scrollY > 0 || refreshing) return;
    startY.current = e.touches[0].clientY;
    tracking.current = true;
  };

  const onTouchMove = (e) => {
    if (!tracking.current || startY.current === null) return;
    const distance = e.touches[0].clientY - startY.current;
    if (distance > 0 && window.scrollY <= 0) {
      setPull(Math.min(distance * 0.5, THRESHOLD));
    } else {
      setPull(0);
    }
  };

  const onTouchEnd = async () => {
    if (!tracking.current) return;
    tracking.current = false;
    startY.current = null;
    if (pull >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}>
      <div
        className="flex items-center justify-center overflow-hidden text-muted-foreground transition-[height] duration-200"
        style={{ height: refreshing ? THRESHOLD : pull }}
      >
        <Loader2
          className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
          style={{ opacity: refreshing ? 1 : pull / THRESHOLD }}
        />
      </div>
      {children}
    </div>
  );
}