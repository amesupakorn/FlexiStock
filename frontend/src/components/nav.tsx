import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaSearch, FaTruck } from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className="min-w-max bg-gray-800 text-white p-6 rounded-r-xl shadow-lg flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-green-400">Flexistock</h1>
      <ul className="space-y-6 w-full">
        <li className="flex items-center w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-md shadow-md transition-all duration-300 w-full justify-start"
                : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-md transition-colors duration-300 w-full justify-start"
            }
          >
            <MdSpaceDashboard  className="mr-3 w-5 h-5" />
            Dashboard
          </NavLink>
        </li>
       
        <li className="flex items-center w-full">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-md shadow-md transition-all duration-300 w-full justify-start"
                : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-md transition-colors duration-300 w-full justify-start"
            }
          >
            <FaSearch className="mr-3" />
            Search
          </NavLink>
        </li>
        <li className="flex items-center w-full">
          <NavLink
            to="/track"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-md shadow-md transition-all duration-300 w-full justify-start"
                : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-md transition-colors duration-300 w-full justify-start"
            }
          >
            <FaTruck className="mr-3" />
            Track Order
          </NavLink>
        </li>
        <li className="flex items-center w-full">
          <NavLink
            to="/warehouse"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-md shadow-md transition-all duration-300 w-full justify-start"
                : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-md transition-colors duration-300 w-full justify-start"
            }
          >
            <FaWarehouse className="mr-3" />
            Warehouse
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;