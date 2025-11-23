"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EventChartClient({
  registrationCount,
  attendeeCount,
}: {
  registrationCount: number;
  attendeeCount: number;
}) {
  const data = {
    labels: ["Registrations", "Attendees"],
    datasets: [
      {
        label: "Count",
        data: [registrationCount, attendeeCount],
        backgroundColor: ["#3B82F6", "#10B981"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-center mb-2">
        Registrations vs Attendees
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}