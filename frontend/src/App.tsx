import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashboard from "./dashboard";
import Search from "./search/search";
import Order from "./order/order";
import Customer from "./order/customer";
import OrderSummary from "./order/summary";
import Navbar from "./components/nav";
import StockPage from "./stock";
import TrackingPage from "./tracking";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar / Navbar */}
        <div className="flex-shrink-0">
          <Navbar />
        </div>

          {/* Main Content */}
          <main className="flex-grow bg-gray-100 overflow-y-auto" style={{ height: 'calc(100vh - 10px)' }}> 
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<StockPage />} />
              <Route path="/track" element={<TrackingPage />} />

              <Route path="/search" element={<Search />} />
              <Route path="/order" element={<Order />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/summary" element={<OrderSummary />} />

            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
