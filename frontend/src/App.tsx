import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Dashboard from "./dashboard";
import Search from "./search/search";
import Order from "./order/order";
import Customer from "./order/customer";
import OrderSummary from "./order/summary";
import Navbar from "./components/nav";
import StockPage from "./stock";
import TrackingTable from "./order/tracking";
import TrackingPage from "./tracking/index";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 overflow-y-auto"> 
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<StockPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/track-list" element={<TrackingTable />} />

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
