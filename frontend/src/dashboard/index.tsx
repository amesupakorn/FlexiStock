import React, { useEffect, useState } from 'react';

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
    <div></div>
  );
};

export default DashboardPage;