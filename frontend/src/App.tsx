import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashboard from "./dashboard";
import Search from "./search/search";
import Warehouse from "./warehouse/warehouse";
import TestApi from "./test/testApi"
import Navbar from "./components/nav";
function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar / Navbar */}
        <div className="flex-shrink-0">
          <Navbar />
        </div>

          {/* Main Content */}
          <main className="flex-grow bg-white overflow-y-auto" style={{ height: 'calc(100vh - 10px)' }}> 
          <div className="container mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/test" element={<TestApi />} />
              </Routes>
            </div>
          </main>
        </div>
    </Router>
  );
}

export default App;
