import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashboard from "./dashboard";
import Search from "./search/search";
import Warehouse from "./warehouse/warehouse";
import TestApi from "./test/testApi"
import Navbar from "./components/nav";
import TrackingPage from "./track/track";


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
              <Route path="/search" element={<Search />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/test" element={<TestApi />} />

            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
