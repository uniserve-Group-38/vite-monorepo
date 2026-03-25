"use client";

import { useEffect, useRef } from "react";

/**
 * When the provider lands on the Messages list (/chat), mark all their unread
 * messages from students as read so the red badge clears.
 */
export function MarkAllReadOnView() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    fetch(import.meta.env.VITE_API_URL + `/api/messages/mark-all-read`, { method: "POST" })
      .then((res) => {
        if (res.ok) {
          window.dispatchEvent(new CustomEvent("refetch-unread-count"));
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
