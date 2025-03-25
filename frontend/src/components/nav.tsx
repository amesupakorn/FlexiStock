import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaSearch, FaChartLine } from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";


const Navbar = () => {
  return (
    <nav className="min-w-max bg-gray-800 text-white p-6 rounded-r-xl shadow-lg h-screen flex flex-col justify-between">
      {/* Logo และ เมนูหลัก */}
      <div>
        <div className="flex items-center justify-center mb-10">
          <h1 className="text-3xl font-extrabold text-center text-green-400">Flexistock</h1>
        </div>
        
        <ul className="space-y-3 w-full">
          <li className="flex items-center w-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-lg shadow-md transition-all duration-300 w-full justify-start"
                  : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors duration-300 w-full justify-start"
              }
            >
              <MdSpaceDashboard className="mr-3 w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li className="flex items-center w-full">
            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-lg shadow-md transition-all duration-300 w-full justify-start"
                  : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors duration-300 w-full justify-start"
              }
            >
              <FaSearch className="mr-3 w-5 h-5" />
              <span>ค้นหา</span>
            </NavLink>
          </li>
          
          <li className="flex items-center w-full">
            <NavLink
              to="/warehouse"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-lg shadow-md transition-all duration-300 w-full justify-start"
                  : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors duration-300 w-full justify-start"
              }
            >
              <FaWarehouse className="mr-3 w-5 h-5" />
              <span>คลังสินค้า</span>
            </NavLink>
          </li>
          
          <li className="flex items-center w-full">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-lg shadow-md transition-all duration-300 w-full justify-start"
                  : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors duration-300 w-full justify-start"
              }
            >
              <FaBox className="mr-3 w-5 h-5" />
              <span>สินค้าคงคลัง</span>
            </NavLink>
          </li>
        </ul>
      </div>
      
      {/* ส่วนล่าง - การตั้งค่าและออกจากระบบ */}
      <div className="mt-auto">
        <div className="pt-6 border-t border-gray-700">
          <ul className="space-y-3 w-full">
            <li className="flex items-center w-full">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-white bg-green-600 px-6 py-3 rounded-lg shadow-md transition-all duration-300 w-full justify-start"
                    : "flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors duration-300 w-full justify-start"
                }
              >
                <IoMdSettings className="mr-3 w-5 h-5" />
                <span>ตั้งค่า</span>
              </NavLink>
            </li>
            
            <li className="flex items-center w-full">
              <button
                className="flex items-center text-gray-400 hover:text-white hover:bg-red-700 px-6 py-3 rounded-lg transition-colors duration-300 w-full justify-start"
                onClick={() => console.log("Logout clicked")}
              >
                <RiLogoutBoxRLine className="mr-3 w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="mt-6 px-4 py-3 bg-gray-700 bg-opacity-40 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">ผู้ใช้งานระบบ</p>
              <p className="text-xs text-gray-400">admin@flexistock.com</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;