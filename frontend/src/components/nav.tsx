import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaSearch, FaChartLine } from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaCartShopping } from "react-icons/fa6";
import { FaRoute } from "react-icons/fa6";


const Navbar = () => {
  return (
    <nav className="w-72 bg-slate-900 text-white shadow-2xl h-screen flex flex-col border-r border-slate-800 sticky top-0">
      {/* Brand Logo Section */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <FaWarehouse className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Flexi<span className="text-green-500">Stock</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">ERP Solutions</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Groups */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Main Section */}
        <div>
          <p className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">General</p>
          <ul className="space-y-1.5">
            <NavItem to="/" icon={<MdSpaceDashboard />} label="Dashboard" />
            <NavItem to="/search" icon={<FaSearch />} label="Search" />
          </ul>
        </div>

        {/* Logistics Section */}
        <div>
          <p className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Logistics</p>
          <ul className="space-y-1.5">
            <NavItem to="/inventory" icon={<FaBox />} label="Inventory" />
            <NavItem to="/track-list" icon={<FaRoute />} label="Tracking Status" />
          </ul>
        </div>

        {/* Sales Section */}
        <div>
          <p className="px-4 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sales & Orders</p>
          <ul className="space-y-1.5">
            <NavItem to="/Order" icon={<FaCartShopping />} label="Create Order" />
          </ul>
        </div>
      </div>
      
      {/* Bottom Section - Settings & Profile */}
      <div className="p-4 mt-auto">
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <ul className="space-y-1.5">
            <NavItem to="/settings" icon={<IoMdSettings />} label="Settings" />
            <li>
              <button
                className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 px-4 py-3 rounded-xl transition-all duration-300 w-full group"
                onClick={() => console.log("Logout clicked")}
              >
                <RiLogoutBoxRLine className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>

          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shadow-lg">
                  AD
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Administrator</p>
                <p className="text-[10px] text-slate-500 truncate font-medium">admin@flexistock.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <li className="list-none">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
          isActive
            ? "bg-green-600 text-white shadow-lg shadow-green-600/20 active-nav-glow"
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        }`
      }
    >
      <span className="text-xl transition-transform group-hover:scale-110">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </NavLink>
  </li>
);

export default Navbar;