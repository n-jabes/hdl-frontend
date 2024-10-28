import React from 'react';
import { FaBars } from 'react-icons/fa';
import { VscBell } from 'react-icons/vsc';

const Header = ({ toggleSidebar }) => {
  return (
    <nav className="bg-[#1A1D1F] px-4 py-2 flex justify-between items-center text-white">
      <button className="block lg:hidden mr-4" onClick={toggleSidebar}>
        <FaBars className="text-white" />
      </button>
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg lg:text-2xl">Dashboard</h1>
        <div className="flex items-center gap-3">
          <VscBell className="h-5 w-5 cursor-pointer" />
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/profile.webp"
              className="border-[1px] border-gray-700 rounded-full h-10 w-10"
              alt="Profile"
            />
            <h2 className="hidden lg:block text-sm">Murekezi Jean</h2>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
