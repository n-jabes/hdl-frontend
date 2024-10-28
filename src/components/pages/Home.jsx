import React, { useState, useEffect } from 'react';
import { IoIosSearch } from 'react-icons/io';
import axios from 'axios';
import TableTemplate from '../tableTemplate/TableTemplate';
import GoogleMapsEmbed from '../mapComponent/GoogleMapsEmbed';
import { Bounce, toast } from 'react-toastify';

const formatDateToYMDHM = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(
    '2',
    '0'
  )}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const Home = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <img
        className="h-[35%] w-[35%]"
        src="/404.png"
        alt="not found page"
      />
      <h2>This page will be available soon!</h2>
    </div>
  );
};

export default Home;
