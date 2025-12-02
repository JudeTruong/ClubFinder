"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [name, setName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      setName(data.name);
    }

    fetchUser();
  }, [userId]);

  return (
    <header className="w-full flex justify-end p-4 text-sm text-gray-700">
      {name ? (
        <p>Logged in as <span className="font-semibold">{name}</span></p>
      ) : (
        <p>Not logged in</p>
      )}
    </header>
  );
}
