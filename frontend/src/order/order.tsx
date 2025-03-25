import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Product, Warehouse } from "../models/product";
import { fetchProduct, fetchWarehouse } from "../api/fetchData";
export default function Order() {
  const [productId, setProductId] = useState("");
  const [products, setProduct] = useState<Product[]>([]);
  const [warehouses, setWarehouse] = useState<Warehouse[]>([]);;


  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
        try {
            const response = await fetchProduct();
            const resware = await fetchWarehouse();
            setProduct(response.data); 
            setWarehouse(response.data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError("Failed to fetch warehouses");
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, []);
  // 🔸 กำหนดรายการสินค้าแบบ static

  const handleSubmit = () => {
    if (!productId || quantity < 1 || warehouses.length === 0) return;
  
    const selectedProduct = products.find(p => p.id === productId);
    const selectedWarehouse = warehouses[0];
  
    if (selectedProduct) {
      const updatedItems = [...selectedItems];
      const index = updatedItems.findIndex(
        item => item.product.id === productId
      );
  
      if (index !== -1) {
        updatedItems[index].quantity += quantity;
        updatedItems[index].total = Number(updatedItems[index].product.price) * updatedItems[index].quantity;

      } else {
        updatedItems.push({
          product: selectedProduct,
          warehouse: selectedWarehouse,
          quantity: quantity,
          total: Number(selectedProduct.price) * quantity,
        });
      }
  
      setSelectedItems(updatedItems);
    }
  
    setProductId("");
    setQuantity(1);
  };

  const handleCancel = () => {
    setProductId("");
    setQuantity(1);
  };

  const handlePlaceOrder = () => {
    // ส่งข้อมูลไปยังหน้า Customer
    navigate("/customer", { state: { selectedItems } });
  };

  const total = selectedItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-8">
      <div className="w-full bg-white rounded-3xl shadow-xl mx-auto overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Multi-Warehouse Order Management
          </h1>
          <p className="text-green-100 mt-2">Select your products and manage your order</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Left - Product Selection */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Select Product</label>
              <div className="relative">
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  <option value="">Choose a Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Quantity</label>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full text-center p-3 border-t border-b border-gray-300"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>Add to Order</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-700">Order Summary</h2>
              <span className="text-sm text-gray-500">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedItems.length === 0 ? (
                
              <div className="text-center py-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                No items in your order
              </div>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item, idx) => (
                    
                    <div 
                        key={idx} 
                        className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <div>
                        <span className="font-medium text-gray-700">{item.product.name}</span>
                        <span className="text-sm text-gray-500 block">
                            Price: ฿{item.product.price.toFixed(2)} x {item.quantity}
                        </span>
                        </div>
                        <span className="text-green-600 font-semibold">
                        ฿{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                    ))}

                    {/* รวมราคาทั้งหมด */}
                    <div className="flex justify-between text-lg font-semibold text-gray-700 mt-4 border-t pt-4">
                    <span>Total</span>
                    <span className="text-green-600">฿{total.toFixed(2)}</span>
                    </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={selectedItems.length === 0}
                className={`w-full p-3 rounded-lg text-white font-semibold transition flex items-center justify-center space-x-2 
                  ${selectedItems.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>Proceed to Customer Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}