import { redirect } from "next/navigation";

export default function EventsIndex() {
  // server component; immediate redirect
  redirect("/club-management");
}