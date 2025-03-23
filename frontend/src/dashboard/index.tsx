import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Stock Level",
        data: [100, 80, 60, 40, 20],
        fill: false,
        borderColor: "red",
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Line data={data} />
  );
};

export default DashboardPage;