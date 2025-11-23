import FilteredBarChart from "./FilteredBarChart";

type DashboardChartsProps = {
  clubRegistrations: { name: string; value: number }[];
  eventRegistrations: { name: string; value: number }[];
  eventAttendees: { name: string; value: number }[];
};

export default function DashboardCharts({
  clubRegistrations,
  eventRegistrations,
  eventAttendees,
}: DashboardChartsProps) {
  return (
    <div className="space-y-10">
      <FilteredBarChart
        title="Club Registrations"
        dataSet={clubRegistrations}
      />

      <FilteredBarChart
        title="Event Registrations"
        dataSet={eventRegistrations}
      />

      <FilteredBarChart
        title="Event Attendees"
        dataSet={eventAttendees}
      />
    </div>
  );
}
