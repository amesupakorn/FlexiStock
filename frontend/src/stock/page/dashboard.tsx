const data = [
    { name: "Item A", location: "Warehouse 1", stock: 30, desired: 100, maxStock: 120 },
    { name: "Item B", location: "Warehouse 2", stock: 70, desired: 100, maxStock: 150 },
    { name: "Item C", location: "Store 1", stock: 45, desired: 80, maxStock: 100 },
    { name: "Item D", location: "Store 2", stock: 90, desired: 120, maxStock: 130 },
  ];
  
  export default function Dashboard() {
    return (
      <main className="flex flex-col min-h-screen items-center justify-start bg-gray-100 p-6">
        {/* Header Section */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Inventory & Parts</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full bg-gray-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
  
        {/* Table Section */}
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Location</th>
              <th className="border border-gray-300 p-3">Stock Level</th>
              <th className="border border-gray-300 p-3">Desired</th>
              <th className="border border-gray-300 p-3">Max Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const stockPercentage = (item.stock / item.maxStock) * 100;
              return (
                <tr key={index} className="text-center hover:bg-gray-100 transition">
                  <td className="p-4 border border-gray-300 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4 border border-gray-300 text-gray-600">{item.location}</td>
                  <td className="p-4 border border-gray-300">
                    <div className="relative w-48 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700"> {item.stock} / {item.maxStock}</span>
                  </td>
                  <td className="p-4 border border-gray-300 text-gray-600">{item.desired}</td>
                  <td className="p-4 border border-gray-300 text-gray-600">{item.maxStock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    );
  }