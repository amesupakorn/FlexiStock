import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashboard from "./dashboard";
import Search from "./search/search";
<<<<<<< HEAD
import Order from "./order/order";
import HomePage from "./home";
=======
import Warehouse from "./warehouse/warehouse";
import TestApi from "./test/testApi"
>>>>>>> main
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
              <Route path="/search" element={<Search />} />
<<<<<<< HEAD
              <Route path="/order" element={<Order />} />
=======
              <Route path="/warehouse" element={<Warehouse />} />


              <Route path="/test" element={<TestApi />} />

>>>>>>> main
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
