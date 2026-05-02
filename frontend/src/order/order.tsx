import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Product } from "../models/product";
import { fetchProduct } from "../api/fetchData";

export default function Order() {
  const [productId, setProductId] = useState("");
  const [products, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchProduct();
        setProduct(response.data);
      } catch {
        setError("Failed to fetch products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedProduct = products.find(p => p.id === productId);

  const handleAddToOrder = () => {
    if (!productId || quantity < 1) return;
    if (!selectedProduct) return;

    const updatedItems = [...selectedItems];
    const index = updatedItems.findIndex(item => item.product.id === productId);

    if (index !== -1) {
      updatedItems[index].quantity += quantity;
      updatedItems[index].total = Number(updatedItems[index].product.price) * updatedItems[index].quantity;
    } else {
      updatedItems.push({
        product: selectedProduct,
        quantity,
        total: Number(selectedProduct.price) * quantity,
      });
    }

    setSelectedItems(updatedItems);
    setProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (idx: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePlaceOrder = () => {
    navigate("/customer", { state: { selectedItems } });
  };

  const total = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-full mx-auto">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Create Order
          </h1>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT: Product Selector Panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* Product Selection Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Select Product
              </h2>

              <div className="space-y-4">
                {/* Product Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-800 font-medium"
                  >
                    <option value="">— Choose a product —</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Product Preview */}
                {selectedProduct && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {selectedProduct.name.charAt(0)}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className="font-semibold text-slate-800 truncate">{selectedProduct.name}</p>
                      <p className="text-sm text-blue-600 font-bold">฿{Number(selectedProduct.price).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                  <div className="flex items-stretch border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 bg-gray-100 text-gray-700 text-xl font-bold hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="flex-grow text-center py-2.5 border-x border-gray-300 text-slate-800 font-bold focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 bg-gray-100 text-gray-700 text-xl font-bold hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal Preview */}
                {selectedProduct && (
                  <div className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                    <span className="text-sm text-slate-500 font-medium">Item subtotal</span>
                    <span className="font-bold text-slate-800">฿{(Number(selectedProduct.price) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Add Button */}
                <button
                  onClick={handleAddToOrder}
                  disabled={!productId}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    productId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Order
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col flex-grow">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Summary
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Item List */}
              <div className="flex-grow">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="font-medium text-slate-400">Your order is empty</p>
                    <p className="text-sm text-slate-300 mt-1">Select a product on the left to begin</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-100 border-b-2 border-slate-200">
                      <tr>
                        {['Product', 'Unit Price', 'Qty', 'Subtotal', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-indigo-600 font-bold text-sm">
                                  {item.product.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-slate-900">{item.product.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            ฿{Number(item.product.price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                              ×{item.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-800">
                            ฿{(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center ml-auto"
                              title="Remove item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Total & CTA */}
              {selectedItems.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-700">Order Total</span>
                    <span className="text-2xl font-extrabold text-blue-600">
                      ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Proceed to Customer Details
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}