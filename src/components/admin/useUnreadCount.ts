"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function loadUnreadCount() {
      const { count: unreadCount } = await supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "unread");

      if (mounted) {
        setCount(unreadCount ?? 0);
      }
    }

    void loadUnreadCount();

    return () => {
      mounted = false;
    };
  }, []);

  return count;
}
