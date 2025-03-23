import { fetchInventory, testAPI, fetchData } from "../api/apiGateway";
import React, { useEffect, useState } from "react";

export default function TestApi() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // ทดสอบ API Gateway
    testAPI().then(setMessage).catch(console.error);

    // ดึงข้อมูล orders
    fetchData()
      .then(setData)
      .catch((err) => console.error("Failed to fetch orders", err));


  }, []);

  return (
    <div>
      <h1>API Gateway Test</h1>
      <p>{message}</p>

      <h2>Data </h2>
      <ul>
        {data.length > 0 ? (
          data.map((data, index) => <li key={index}>{JSON.stringify(data)}</li>)
        ) : (
          <p>No data found.</p>
        )}
      </ul>

     
    </div>
  );
}