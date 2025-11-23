import { prisma } from "@/lib/prisma";

import DashboardCharts from "./DashboardCharts";

export default async function DashboardPage() {
  // Fetch clubs & events
  const clubs = await prisma.club.findMany({
    include: {
      memberships: true,
    },
  });

  const events = await prisma.event.findMany({
    include: {
      registrations: true,
    },
  });

  // Format for charts
  const clubData = clubs.map(c => ({
    name: c.name,
    value: c.memberships.length,
  }));

  const eventRegistrationData = events.map(e => ({
    name: e.title,
    value: e.registrations.length,
  }));

  const eventAttendeeData = events.map(e => ({
    name: e.title,
    value: e.attendees,
  }));

  return (
    <div className="p-8">
      <DashboardCharts
        clubRegistrations={clubData}
        eventRegistrations={eventRegistrationData}
        eventAttendees={eventAttendeeData}
      />
    </div>
  );
}