"use client";

import { useEffect, useState, useTransition } from "react";

type Props =
  | { kind: "club"; targetId: number; initialSubscribed?: boolean }
  | { kind: "event"; targetId: number; initialSubscribed?: boolean };

export default function SubscribeButton({ kind, targetId, initialSubscribed }: Props) {
  const [subscribed, setSubscribed] = useState<boolean>(!!initialSubscribed);
  const [isPending, startTransition] = useTransition();

  // Fetch initial subscription state if not passed in
  useEffect(() => {
    if (initialSubscribed !== undefined) return;

    const url =
      kind === "club"
        ? `/api/subscriptions/club?clubId=${targetId}`
        : `/api/subscriptions/event?eventId=${targetId}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.subscribed === "boolean") setSubscribed(data.subscribed);
      })
      .catch(() => {});
  }, [kind, targetId, initialSubscribed]);

  // Toggle subscription state
  const toggleSubscription = () => {
    startTransition(async () => {
      const url = kind === "club" ? "/api/subscriptions/club" : "/api/subscriptions/event";
      const body =
        kind === "club"
          ? { clubId: targetId, action: subscribed ? "unsubscribe" : "subscribe" }
          : { eventId: targetId, action: subscribed ? "unsubscribe" : "subscribe" };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setSubscribed(!!data.subscribed);
      }
    });
  };

  return (
    <button
      onClick={toggleSubscription}
      disabled={isPending}
      className={`px-4 py-2 rounded-xl border text-sm font-medium transition
        ${subscribed ? "bg-green-100 border-green-400 text-green-700" : "bg-white border-gray-300 text-gray-700"}
        ${isPending ? "opacity-60 cursor-not-allowed" : "hover:shadow"}
      `}
    >
      {isPending ? "Saving..." : subscribed ? "Subscribed ✓" : "Subscribe"}
    </button>
  );
}
