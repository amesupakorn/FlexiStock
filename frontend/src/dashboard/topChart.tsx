import { TbBuildingWarehouse } from "react-icons/tb";
import { FaCartShopping } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";



const statCards = [
    { title: "Warehouse", value: 3, icon: <TbBuildingWarehouse/> },
    { title: "Order", value: 450, icon: <FaCartShopping />    },
    { title: "Total Price", value: "฿2500", icon: <FaMoneyBillTrendUp />
    },
  ];

  
const TopChart = () => {


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-4">
            {statCards.map((card, idx) => (
            <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow flex items-center gap-4"
            >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-zinc-800 text-2xl">
                    {card.icon}
                </div>
                <div>
                <h3 className="text-gray-600 text-sm">{card.title}</h3>
                <p className="text-xl font-bold">{card.value}</p>
                </div>
            </div>
            ))}
        </div>

    )
}

export default TopChart