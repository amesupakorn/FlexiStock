import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./stock/page/dashboard";
import Manage from "./stock/page/manage";
import Search from "./stock/page/search";

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
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <nav className="min-w-max bg-gray-800 text-white p-6 rounded-r-xl shadow-lg">
  <h1 className="text-2xl font-bold mb-8 text-center">Menu</h1>
  <ul>
    <li className="mb-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-green-600 px-4 py-2 rounded-md transition-colors duration-300"
            : "hover:text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-300"
        }
      >
        Home
      </NavLink>
    </li>
    <li className="mb-4">
      <NavLink
        to="/manage"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-green-600 px-4 py-2 rounded-md transition-colors duration-300"
            : "hover:text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-300"
        }
      >
        Manage Stock
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/search"
        className={({ isActive }) =>
          isActive
            ? "text-white bg-green-600 px-4 py-2 rounded-md transition-colors duration-300"
            : "hover:text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-300"
        }
      >
        Search
      </NavLink>
    </li>
  </ul>
</nav>


        {/* Main Content */}
        <main className="flex-1  bg-white">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
