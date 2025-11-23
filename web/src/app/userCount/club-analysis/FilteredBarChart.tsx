"use client";

import { useState, useMemo } from "react";
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

// Props type
type FilteredBarChartProps = {
  title: string;
  dataSet: { name: string; value: number }[];
};

// Filter type for state
type FilterType = "top" | "bottom";

// Use the props type here
export default function FilteredBarChart({
  title,
  dataSet,
}: FilteredBarChartProps) {
  const [filterType, setFilterType] = useState<FilterType>("top"); // type the state

  const filtered = useMemo(() => {
    const sorted = [...dataSet].sort((a, b) =>
      filterType === "top" ? b.value - a.value : a.value - b.value
    );
    return sorted.slice(0, 10);
  }, [dataSet, filterType]);

  const chartData = {
    labels: filtered.map((item) => item.name),
    datasets: [
      {
        label: title,
        data: filtered.map((item) => item.value),
        backgroundColor: "#3B82F6",
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
    <div className="mt-10">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="border rounded px-2"
        >
          <option value="top">Top 10</option>
          <option value="bottom">Bottom 10</option>
        </select>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}