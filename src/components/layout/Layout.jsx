// src/components/Layout.jsx
import React, { useState } from 'react';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import { FaChartBar, FaHome } from 'react-icons/fa';
import { FaFileInvoiceDollar, FaPeopleGroup } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarFields = [
    {
      destination: '/hr/statistics',
      icon: <FaChartBar className="mr-2" />,
      title: 'Statistics',
    },
    {
      destination: '/hr/attendees',
      icon: <FaPeopleGroup className="mr-2" />,
      title: 'Antendees',
    },
    {
      destination: '/hr/restaurant',
      icon: <FaFileInvoiceDollar className="mr-2" />,
      title: 'Restaurant',
    },
    {
      destination: '/hr/guests',
      icon: <BsPeopleFill className="mr-2" />,
      title: 'Guests',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        sidebarFields={sidebarFields}
      />
      <div className="flex-1 w-full flex flex-col ml-0 lg:ml-64 transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 overflow-y-auto ">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
