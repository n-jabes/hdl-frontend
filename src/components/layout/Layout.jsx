// src/components/Layout.jsx
import React, { useEffect, useState } from 'react';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import { FaChartBar, FaFileInvoiceDollar } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';
import { BsPeopleFill } from 'react-icons/bs';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

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
      title: 'Attendees',
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

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex w-[100vw] h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        sidebarFields={sidebarFields}
      />
      <div
        className="flex flex-col ml-0 lg:ml-64 transition-all duration-300"
        style={{ width: isLargeScreen ? `calc(100vw - 16rem)` : '100vw' }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
