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
  return <h2>Dashboard</h2>;
};

export default Home;
