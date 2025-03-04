import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    axios.get("http://localhost:5001/api/test")
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        setMessage("Failed to connect to backend");
        console.error("Error connecting to backend:", error);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Frontend - Backend Connection Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;