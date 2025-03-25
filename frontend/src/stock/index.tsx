'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { fetchInventoryDetail } from '../api/fetchData';
import { useNavigate } from 'react-router-dom';
import { handleAlert } from '../components/swifAlert';

const StockPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouse');
  const [warehouseOptions, setWarehouseOptions] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('All Product');
  const [productOptions, setProductOptions] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isEditMinMaxModalOpen, setIsEditMinMaxModalOpen] = useState(false);

  const navigate = useNavigate();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [stockForm, setStockForm] = useState({
    productId: '',
    warehouseId: '',
    stock: 0,
    minStock: 0,
    maxStock: 0,
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    price: '',
    stock: '',
    general: ''
  });


  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const response = await fetchInventoryDetail();
        setInventory(response.data);
  
        // Extract unique warehouses and products
        const warehouses = Array.from(new Set(response.data.map((item: any) => item.warehouse.name)));
        setWarehouseOptions(['All Warehouse', ...warehouses]);
  
        const products = Array.from(new Set(response.data.map((item: any) => item.product.name)));
        setProductOptions(['All Product', ...products]);
      } catch (error) {
        console.error('Error fetching stock:', error);
        setFormErrors(prev => ({
          ...prev, 
          general: 'Failed to load inventory data'
        }));
      } finally {
        setLoading(false);
      }
    };
  
    fetchInventoryData();
  }, []); 

  // Handle search and filter functions
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleWarehouseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value);
  };

  // Filtered inventory based on search and filters
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWarehouse = selectedWarehouse === 'All Warehouse' || item.warehouse.name === selectedWarehouse;
      const matchesProduct = selectedProduct === 'All Product' || item.product.name === selectedProduct;

      return matchesSearch && matchesWarehouse && matchesProduct;
    });
  }, [inventory, searchTerm, selectedWarehouse, selectedProduct]);

  // Validate product form
  const validateProductForm = () => {
    const errors = {
      name: '',
      price: '',
      general: ''
    };

    // Validate name
    if (!productForm.name.trim()) {
      errors.name = 'Product name is required';
    }

    // Validate price
    const priceValue = parseFloat(productForm.price);
    if (!productForm.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Invalid price';
    }

    setFormErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  // Validate stock form
  const validateStockForm = () => {
    const errors = {
      stock: '',
      general: ''
    };

    if (stockForm.stock <= 0) {
      errors.stock = 'Stock must be greater than 0';
    }

    setFormErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));

    setFormErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStockForm(prev => ({
      ...prev,
      [name]: value
    }));

    setFormErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  // Handle opening modals
  const handleOpenModal = (type: 'product' | 'stock') => {
    if (type === 'product') {
      setIsModalOpen(true);
      setIsStockModalOpen(false);
    } else if (type === 'stock') {
      setIsStockModalOpen(true);
      setIsModalOpen(false);
    }
  };

  // Submit new product
  const handleSubmitProduct = async () => {
    setFormErrors(prev => ({ ...prev, general: '' }));

    if (!validateProductForm()) return;

    try {
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price)
      };

      await axios.post('http://localhost:5003/create/product', productData);
      setProductForm({ name: '', description: '', price: '' });
      setIsModalOpen(false);


      await fetchInventoryDetail();
    } catch (error) {
      console.error('Error adding product:', error);
      setFormErrors(prev => ({
        ...prev, 
        general: 'Failed to add product. Please try again.'
      }));
    }
  };

  // Submit stock update
  const handleSubmitStock = async () => {
    setFormErrors(prev => ({ ...prev, general: '' }));

    if (!validateStockForm()) return;

    try {
      const stockData = {
        productId: stockForm.productId,
        warehouseId: stockForm.warehouseId,
        stock: stockForm.stock,
        minStock: stockForm.minStock,
        maxStock: stockForm.maxStock,
      };

      await axios.post('http://localhost:5003/create/inventory', stockData);
      setStockForm({ productId: '', warehouseId: '', stock: 0, minStock: 0, maxStock: 0 });
      setIsStockModalOpen(false);
      await fetchInventoryDetail();
    } catch (error) {
      console.error('Error adding stock:', error);
      setFormErrors(prev => ({
        ...prev, 
        general: 'Failed to add stock. Please try again.'
      }));
    }
  };


  const handleAdjustStock = async (item, type) => {
    const amount = prompt(`Enter amount to ${type === 'add' ? 'add' : 'remove'}:`);
  
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid number greater than 0");
      return;
    }
  
    const stockChange = type === "add" ? parsedAmount : -parsedAmount;
  
    try {
      const response = await fetch(`http://localhost:5003/update/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stockChange }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
  
      const updatedItem = await response.json();
  
      setInventory((prev) =>
        prev.map((inv) => (inv.id === updatedItem.id ? updatedItem : inv))
      );

      handleAlert({title:"Update Success", icon: "success"})

      setTimeout(() => {
      window.location.reload();
      }, 1500);                              

    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock");
    }
  };


  const handleEditMinMax = (item) => {
    setSelectedInventory(item);
    setIsEditMinMaxModalOpen(true); 
  };

  


  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Stock Management
          </h1>
          
          <div className="flex flex-wrap gap-3 justify-end">
            <button 
              onClick={() => handleOpenModal('product')} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Product
            </button>
            <button 
              onClick={() => handleOpenModal('stock')} 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Add Stock
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-grow min-w-[200px]">
              <input
                type="text"
                placeholder="Search products or warehouses"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select 
              value={selectedWarehouse} 
              onChange={handleWarehouseChange} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {warehouseOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select 
              value={selectedProduct} 
              onChange={handleProductChange} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {productOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
             <table className="w-full border-collapse">
                <thead className="bg-slate-100 border-b-2 border-slate-200">
                    <tr>
                    {[
                        'Product', 
                        'Warehouse', 
                        'Stock Range',
                        'Stock Now',
                        'Inventory Status', 
                        'Actions'
                    ].map((header) => (
                        <th 
                        key={header} 
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                        >
                        {header}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredInventory.map((item, index) => (
                    <tr 
                        key={index} 
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                    >
                        {/* Product Column */}
                        <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-bold">
                                {item.product.name.charAt(0).toUpperCase()}
                            </span>
                            </div>
                            <div>
                            <div className="text-sm font-medium text-slate-900">{item.product.name}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[150px]">
                                SKU: {item.product.id || 'N/A'}
                            </div>
                            </div>
                        </div>
                        </td>

                        {/* Warehouse Column */}
                        <td className="px-4 py-3 text-base text-slate-600">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m4 0h1m-1-4h1m-1 4h1v5m-5-9h5v5h-5V7z" />
                            </svg>
                            {item.warehouse.name}
                        </div>
                        </td>

                        {/* Stock Range Column */}
                        <td className="px-4 py-3">
                        <div className="flex space-x-2 justify-left">
                            <span className="bg-green-50 text-green-600 px-4 py-1 rounded-full text-base">
                            Min: {item.minStock}
                            </span>
                            <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-base">
                            Max: {item.maxStock}
                            </span>
                        </div>
                        </td>
                        <td className="px-4 py-3">
                             <span className="bg-slate-100 text-slate-600 px-8 py-1 rounded-full text-base">
                                {item.stock}                            
                             </span>
                       
                        </td>
                        {/* Inventory Status Column */}
                        <td className="px-4 py-3">
                            <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                <div
                                className="h-4 rounded-full transition-all duration-300 ease-in-out absolute top-0 left-0"
                                style={{
                                    width: `${(item.stock / item.maxStock) * 100}%`,
                                    backgroundColor: 
                                    item.stock / item.maxStock < 0.3
                                        ? '#EF4444'  // Red for low stock
                                        : item.stock / item.maxStock < 0.7
                                        ? '#FBBF24'  // Yellow for medium stock
                                        : '#10B981'  // Green for high stock
                                }}
                                />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-slate-600 font-semibold">
                            <span className="text-base font-bold text-slate-900 mr-1">{item.stock}</span>
                            <span className="text-slate-500">/ {item.maxStock}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                            {Math.round((item.stock / item.maxStock) * 100)}%
                            </div>
                        </div>
                </td>
                        {/* Actions Column */}
                        <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                    <button
                    onClick={() => handleEditMinMax(item)}
                    className="bg-amber-400 hover:bg-amber-500 text-white text-xs px-2.5 py-1.5 rounded-md transition flex items-center justify-center space-x-1"
                    title="Edit Limits"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    </button>
                    <button
                    onClick={() => handleAdjustStock(item, 'add')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2.5 py-1.5 rounded-md transition flex items-center justify-center space-x-1"
                    title="Add Stock"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    </button>
                    <button
                    onClick={() => handleAdjustStock(item, 'remove')}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2.5 py-1.5 rounded-md transition flex items-center justify-center space-x-1"
                    title="Remove Stock"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>
                </td>
                    </tr>
                    ))}
                </tbody>
                </table>
          </div>
      </div>


      {/* Add Product Modal */}
      {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Add New Product
                    </h2>
                    <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                        Product Name 
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                        ${formErrors.name 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                        placeholder="Enter product name"
                    />
                    {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {formErrors.name}
                        </p>
                    )}
                    </div>
                    
                    <div>
                    <label className="block text-gray-700 mb-2">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={productForm.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-500"
                        placeholder="Optional description"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                        Price 
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                        ${formErrors.price 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                        placeholder="Enter price"
                    />
                    {formErrors.price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {formErrors.price}
                        </p>
                    )}
                    </div>

                    {formErrors.general && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.general}
                    </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitProduct}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Product
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* Stock Modal */}
            {isStockModalOpen && (
            <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    Add New Stock
                    </h2>
                    <button 
                    onClick={() => setIsStockModalOpen(false)}
                    className="text-white hover:bg-green-700 p-2 rounded-full transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                    <label className="block text-gray-700 mb-2">Product</label>
                    <select
                        name="productId"
                        value={stockForm.productId}
                        onChange={handleStockInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none focus:border-green-500"
                    >
                        <option value="">Select product</option>
                        {productOptions.map((product) => (
                        <option key={product} value={product}>
                            {product}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 mb-2">Warehouse</label>
                    <select
                        name="warehouseId"
                        value={stockForm.warehouseId}
                        onChange={handleStockInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none focus:border-green-500"
                    >
                        <option value="">Select warehouse</option>
                        {warehouseOptions.map((warehouse) => (
                        <option key={warehouse} value={warehouse}>
                            {warehouse}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                        Stock 
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={stockForm.stock}
                        onChange={handleStockInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none 
                        ${formErrors.stock 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-green-200 focus:border-green-500'}`}
                    />
                    {formErrors.stock && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {formErrors.stock}
                        </p>
                    )}
                    </div>

                    <div>
                    <label className="block text-gray-700 mb-2">Min Stock</label>
                    <input
                        type="number"
                        name="minStock"
                        value={stockForm.minStock}
                        onChange={handleStockInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none focus:border-green-500"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 mb-2">Max Stock</label>
                    <input
                        type="number"
                        name="maxStock"
                        value={stockForm.maxStock}
                        onChange={handleStockInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none focus:border-green-500"
                    />
                    </div>

                    {formErrors.general && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.general}
                    </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => setIsStockModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitStock}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Stock
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

            {isEditMinMaxModalOpen && selectedInventory && (
            <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 ">
                <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Edit Min/Max Stock
                    </h2>
                    <button 
                        onClick={() => setIsEditMinMaxModalOpen(false)}
                        className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>

                <div className='p-4'>
                <form
                    onSubmit={async (e) => {
                    e.preventDefault();
                    const minStock = parseInt(e.target.minStock.value);
                    const maxStock = parseInt(e.target.maxStock.value);

                    try {
                        const response = await fetch(`http://localhost:5003/update/${selectedInventory.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ minStock, maxStock }),
                        });

                        if (!response.ok) throw new Error("Update failed");

                        const updated = await response.json();
                        setInventory((prev) =>
                        prev.map((inv) => (inv.id === updated.id ? updated : inv))
                        );
                        setIsEditMinMaxModalOpen(false);

                        handleAlert({title:"Update Success", icon: "success"})

                        setTimeout(() => {
                        window.location.reload();
                        }, 1500);                              

                    } catch (error) {
                        console.error(error);
                        handleAlert({title:"Failed to update min/max", icon: "error"})
                    }
                    }}
                >
                    <label className="block mb-2">
                    Min Stock:
                    <input
                        name="minStock"
                        type="number"
                        defaultValue={selectedInventory.minStock}
                        className="w-full mt-1 p-2 border rounded"
                        required
                    />
                    </label>
                    <label className="block mb-4">
                    Max Stock:
                    <input
                        name="maxStock"
                        type="number"
                        defaultValue={selectedInventory.maxStock}
                        className="w-full mt-1 p-2 border rounded"
                        required
                    />
                    </label>
                    <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setIsEditMinMaxModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    </div>
                </form>
                </div>
               
                </div>
            </div>
            )}
      
    </main>
  );
};

export default StockPage;
