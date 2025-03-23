import axios from "axios";

export const callForecast = async () => {
  const data = [
    { ds: "2024-01-01", y: 100 },
    { ds: "2024-01-02", y: 110 },
    { ds: "2024-01-03", y: 90 },
  ];

  try {
    const res = await axios.post("http://localhost:8000/forecast", data);
    return res.data;
  } catch (err) {
    console.error("Forecast error:", err);
    throw err;
  }
};