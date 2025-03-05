import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashboard from "./stock/page/dashboard";
import Manage from "./stock/page/manage";
import Search from "./stock/page/search";
import HomePage from "./home";
import Navbar from "./components/nav";
function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1  bg-white">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<HomePage/>} />
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
