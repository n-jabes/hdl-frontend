import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdWarning,
  MdSettings,
  MdEmergencyShare,
  MdCrisisAlert,
} from 'react-icons/md';
import { FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaMapLocationDot } from 'react-icons/fa6';
import { RiUserLocationFill } from 'react-icons/ri';
import { LuMonitorX } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [sensitiveAreasDropdownOpen, setSensitiveAreasDropdownOpen] =
    useState(false);

  const location = useLocation(); // Get the current location

  const handleToggle = (setState) => () => setState((prevState) => !prevState);

  const isActive = (path) => location.pathname === path;

  const handleClose = (e) => {
    e.preventDefault();
    toggleSidebar();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-mainBlack text-white border-r-[1px] border-r-gray-700 w-64 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-lg`}
    >
      <Link
        to="/"
        className="flex flex-row items-center py-2 px-4 border-b border-gray-700 pb-3 relative"
      >
        <div className="w-max rounded-full flex items-center justify-center">
          <img
            src="/hdl_logo.png"
            alt="HDL Logo"
            className="w-full h-12 object-cover mr-2"
          />
        </div>
        <h2 className="text-lg font-bold">HDL</h2>
        <IoClose
          className="block lg:hidden h-5 w-5 absolute right-4 cursor-pointer"
          onClick={handleClose}
        />
      </Link>

      <ul className="mt-4 space-y-1 pl-3 text-sm flex flex-col gap-2">
        <li>
          <Link
            to="/"
            className={`flex items-center px-4 py-3 ${
              isActive('/')
                ? 'bg-gray-700 rounded-l-[5px]'
                : 'hover:bg-gray-700 hover:rounded-l-[5px]'
            }`}
          >
            <MdDashboard className="mr-3 h-4 w-4" />
            <span>Home</span>
          </Link>
        </li>

        {/* Location Dropdown */}
        <li>
          <div
            onClick={handleToggle(setLocationDropdownOpen)}
            className={`flex items-center px-4 py-3 ${
              location.pathname.includes('/targeted-subscriber') ||
              location.pathname.includes('/massive-subscribers')
                ? 'text-gray-400 rounded-l-[5px]'
                : 'hover:bg-gray-700 hover:rounded-l-[5px]'
            } cursor-pointer`}
          >
            <FaMapLocationDot className="mr-3 w-4 h-4" />
            <span>Location</span>
            {locationDropdownOpen ? (
              <FiChevronUp className="ml-auto" />
            ) : (
              <FiChevronDown className="ml-auto" />
            )}
          </div>
          {locationDropdownOpen && (
            <ul className="ml-8 space-y-1">
              <li>
                <Link
                  to="/targeted-subscriber"
                  className={`flex items-center px-4 py-2 ${
                    isActive('/targeted-subscriber')
                      ? 'bg-gray-700 rounded-l-[5px]'
                      : 'hover:bg-gray-700 hover:rounded-l-[5px]'
                  }`}
                >
                  <RiUserLocationFill className="mr-3 h-4 w-4" />
                  <span>Targeted Subscriber</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/massive-subscribers"
                  className={`flex items-center px-4 py-2 ${
                    isActive('/massive-subscribers')
                      ? 'bg-gray-700 rounded-l-[5px]'
                      : 'hover:bg-gray-700 hover:rounded-l-[5px]'
                  }`}
                >
                  <FiUsers className="mr-3 w-4 h-4" />
                  <span>Massive Subscribers</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/device-tracing"
            className={`flex items-center px-4 py-2 ${
              isActive('/device-tracing')
                ? 'bg-gray-700 rounded-l-[5px]'
                : 'hover:bg-gray-700 hover:rounded-l-[5px]'
            }`}
          >
            <img
              src="/device_tracking.png"
              className="h-5 w-5 mr-3"
              alt="Device Tracing"
            />
            <span>Device Tracing</span>
          </Link>
        </li>
        <li>
          <Link
            to="/emergency-alert"
            className={`flex items-center px-4 py-3 ${
              isActive('/emergency-alert')
                ? 'bg-gray-700 rounded-l-[5px]'
                : 'hover:bg-gray-700 hover:rounded-l-[5px]'
            }`}
          >
            <MdEmergencyShare className="mr-3 h-4 w-4" />
            <span>Emergency Alert</span>
          </Link>
        </li>

        {/* Sensitive Areas Dropdown */}
        <li>
          <div
            onClick={handleToggle(setSensitiveAreasDropdownOpen)}
            className={`flex items-center px-4 py-3 ${
              location.pathname.includes('/add-sensitive-area') ||
              location.pathname.includes('/monitor-sensitive-area')
                ? 'text-gray-400 rounded-l-[5px]'
                : 'hover:bg-gray-700 hover:rounded-l-[5px]'
            } cursor-pointer`}
          >
            <MdWarning className="mr-3 w-4 h-4" />
            <span>Sensitive Areas</span>
            {sensitiveAreasDropdownOpen ? (
              <FiChevronUp className="ml-auto" />
            ) : (
              <FiChevronDown className="ml-auto" />
            )}
          </div>
          {sensitiveAreasDropdownOpen && (
            <ul className="ml-8 space-y-1">
              <li>
                <Link
                  to="/add-sensitive-area"
                  className={`flex items-center px-4 py-2 ${
                    isActive('/add-sensitive-area')
                      ? 'bg-gray-700 rounded-l-[5px]'
                      : 'hover:bg-gray-700 hover:rounded-l-[5px]'
                  }`}
                >
                  <MdSettings className="mr-3 h-4 w-4" />
                  <span>Add a Sensitive Area</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/monitor-sensitive-area"
                  className={`flex items-center px-4 py-2 ${
                    isActive('/monitor-sensitive-area')
                      ? 'bg-gray-700 rounded-l-[5px]'
                      : 'hover:bg-gray-700 hover:rounded-l-[5px]'
                  }`}
                >
                  <LuMonitorX className="mr-3 w-4 h-5" />
                  <span>Monitor Sensitive Area</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link
            to="/send-alert"
            className={`flex items-center px-4 py-3 ${
              isActive('/send-alert')
                ? 'bg-gray-700 rounded-l-[5px]'
                : 'hover:bg-gray-700 hover:rounded-l-[5px]'
            }`}
          >
            <MdCrisisAlert className="mr-3 h-4 w-4" />
            <span>Send Alert</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
