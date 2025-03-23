import { useEffect, useState } from "react";
import { Warehouse } from "../models/product";
import { Card, CardContent } from "../components/ui/card";
import { FaWarehouse, FaMapMarkerAlt, FaBox } from "react-icons/fa";
import { fetchData } from "../api/apiGateway";

const GOOGLE_MAPS_API_KEY = import.meta.env.GOOGLE_MAPS_API_KEY;

export default function WarehousePage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchData();
                setWarehouses(response.data); 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setError("Failed to fetch warehouses");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p className="text-left text-lg font-semibold text-gray-700 pl-6">Loading warehouses...</p>;
    if (error) return <p className="text-left text-red-500 text-lg font-semibold pl-6">{error}</p>;

    return (
        <main className="flex flex-col min-h-screen bg-gray-100 p-6 text-left">
            <div className="w-full">
                <h1 className="text-3xl font-bold text-left text-green-600 mb-10 flex items-center gap-2">
                     Warehouse List
                </h1>
                <div className="flex flex-col gap-4">
                    {warehouses.map((warehouse) => (
                        <Card key={warehouse.id}>
                            <CardContent>
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaWarehouse className="text-green-600" /> {warehouse.name}
                                </h2>
                                <p className="text-md text-gray-600 mt-2 flex items-center gap-2 mb-2">
                                    <FaMapMarkerAlt className="text-red-500" /> Location: {warehouse.location}
                                </p>
                                <p className="text-md text-gray-600 flex items-center gap-2">
                                    <FaBox className="text-blue-500" /> Capacity: {warehouse.capacity}
                                </p>
                                <div className="mt-4">
                                    <iframe
                                        width="100%"
                                        height="200"
                                        className="rounded-md border border-gray-300"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(warehouse.location)}&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
};
