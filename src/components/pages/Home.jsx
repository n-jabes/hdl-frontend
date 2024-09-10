import React, { useState, useEffect } from 'react';
import { IoIosSearch } from 'react-icons/io';
import axios from 'axios';
import TableTemplate from '../tableTemplate/TableTemplate';
import GoogleMapsEmbed from '../mapComponent/GoogleMapsEmbed';

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
  const [filterType, setFilterType] = useState('IMSI');
  const [filterValue, setFilterValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [isStillLoading, setIsStillLoading] = useState(false);

  const KIGALI_COORDINATES = { lat: -1.9577, lng: 30.1127 };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const getLocationDetails = async (locationCode) => {
    const parts = locationCode.split('-');
    const ci = parts[parts.length - 1];

    if (isNaN(ci) || ci === '?') {
      return {
        CoreLocation: 'Unknown',
        MCC: 'Unknown',
        MNC: 'Unknown',
        LAC: 'Unknown',
        RAC: 'Unknown',
        CI: 'Unknown',
        SiteName: 'Unknown',
        SectorLocation: 'Unknown',
        Longitude: '30.1127',
        Latitude: '-1.9577',
        Azimuth: 'Unknown',
      };
    }

    try {
      const response = await axios.get(
        `https://hdl-backend.onrender.com/core-areas/search-CI/${ci}`
      );

      const location = response?.data?.data?.coreAreas[0];

      if (location) {
        return location;
      } else {
        return {
          CoreLocation: 'Unknown',
          MCC: 'Unknown',
          MNC: 'Unknown',
          LAC: 'Unknown',
          RAC: 'Unknown',
          CI: 'Unknown',
          SiteName: 'Unknown',
          SectorLocation: 'Unknown',
          Longitude: '30.1127',
          Latitude: '-1.9577',
          Azimuth: 'Unknown',
        };
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      return {
        CoreLocation: 'Unknown',
        MCC: 'Unknown',
        MNC: 'Unknown',
        LAC: 'Unknown',
        RAC: 'Unknown',
        CI: 'Unknown',
        SiteName: 'Unknown',
        SectorLocation: 'Unknown',
        Longitude: '30.1127',
        Latitude: '-1.9577',
        Azimuth: 'Unknown',
      };
    }
  };

  const GetAllSubscribers = async () => {
    setIsFetchingSubscribers(true);
    setIsStillLoading(true);
    try {
      const response = await axios.get(
        'https://hdl-backend.onrender.com/subscribers/all'
      );
      const subscribers = response?.data?.data?.users;
      

      // Process subscribers one by one
      for (let i = 0; i < subscribers.length; i++) {
        const subscriber = subscribers[i];
        const locationDetails = await getLocationDetails(subscriber.Location);
        const enhancedSubscriber = {
          ...subscriber,
          SiteName: locationDetails.SiteName,
          SectorLocation: locationDetails.SectorLocation,
        };

        // Update state with each processed subscriber
        setAllSubscribers((prevSubscribers) => [
          ...prevSubscribers,
          enhancedSubscriber,
        ]);
        setFilteredData((prevFilteredData) => [
          ...prevFilteredData,
          enhancedSubscriber,
        ]);

        setIsFetchingSubscribers(false);
        // Optional: Add a small delay to prevent overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setIsStillLoading(false);
      toast.info('Finished fetching', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      console.log('Failed to fetch subscribers', error);
    }
  };

  useEffect(() => {
    GetAllSubscribers();
  }, []);

  const filterSubscribers = () => {
    let filtered = allSubscribers;

    if (filterValue) {
      filtered = filtered.filter((subscriber) =>
        subscriber[filterType].includes(filterValue)
      );
    }

    if (fromDate) {
      filtered = filtered.filter(
        (subscriber) => new Date(subscriber.startTime) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (subscriber) => new Date(subscriber.startTime) <= new Date(toDate)
      );
    }

    const formattedData = filtered.map((subscriber, index) => ({
      id: index + 1,
      count: index + 1,
      startTime: formatDateToYMDHM(subscriber.startTime),
      IMSI: subscriber.IMSI,
      MSISDN: subscriber.MSISDN,
      maskedMSISDN: '*******',
      IMEI: subscriber.IMEI,
      MM: subscriber.MM,
      R: subscriber.R,
      Location: subscriber.Location,
      SiteName: subscriber.SiteName,
      SectorLocation: subscriber.SectorLocation,
    }));

    setFilteredData(formattedData);
  };

  const handleClearAll = () => {
    setFilterValue('');
    setFilterType('IMSI');
    setFromDate('');
    setToDate('');
    setFilteredData(allSubscribers);
  };

  const handleRowClick = async (subscriber) => {
    const selectedMSISDN = subscriber.MSISDN;

    console.log('Clicked row: ', selectedMSISDN);
    const locations = filteredData
      .filter((row) => row.MSISDN === selectedMSISDN)
      .map((item) => item.Location);

    console.log('locations', locations);

    const coordinates = [];

    for (const locationCode of locations) {
      const location = await getLocationDetails(locationCode);
      if (location) {
        const coordinate = {
          lat: parseFloat(location.Latitude),
          lng: parseFloat(location.Longitude),
        };
        coordinates.push(coordinate);
      }
    }

    console.log('coordinates', coordinates);
    setSelectedCoordinates(coordinates);
  };

  return (
    <div className="h-max lg:h-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="h-max lg:max-h-full lg:h-full w-full lg:w-3/5 flex flex-col gap-2 overflow-auto flex-shrink-0">
        {/* operator and date filters form */}
        <div className="flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-2 py-3">
          <form
            action="#"
            className="flex flex-wrap gap-2 items-end justify-between w-full"
            onSubmit={(e) => {
              e.preventDefault();
              filterSubscribers();
            }}
          >
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="operator" className="text-xs">
                Operator
              </label>
              <select
                name="operator"
                id="operator"
                className="w-max bg-gray-100 text-gray-700 text-xs py-[3px] px-2 outline-none rounded-[2px]"
              >
                <option value="MTN">MTN</option>
                <option value="Airtel">Airtel</option>
                <option value="KTRN">KTRN</option>
              </select>
            </div>
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="fromDate" className="text-xs">
                From
              </label>
              <input
                type="datetime-local"
                placeholder="Start Date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="w-max bg-gray-100 text-gray-700 py-[3px] px-2 outline-none rounded-[2px] text-xs cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="toDate" className="text-xs">
                To
              </label>
              <input
                type="datetime-local"
                placeholder="End Date"
                value={toDate}
                onChange={handleToDateChange}
                className="w-max bg-gray-100 text-gray-700 py-[3px] px-2 outline-none rounded-[2px] text-xs cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="py-[6px] px-6 text-xs bg-mainBlue hover:bg-blue-500 text-white rounded"
            >
              Filter
            </button>
          </form>
        </div>
        {/* table */}
        <div className="flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-4 py-3">
          {/* filters */}
          <form
            action="#"
            className="flex gap-2 flex-wrap items-end justify-between w-full"
            onSubmit={(e) => {
              e.preventDefault();
              filterSubscribers();
            }}
          >
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="subscriber" className="text-xs">
                Subscriber
              </label>
              <select
                name="subscriber"
                id="subscriber"
                value={filterType}
                onChange={handleFilterTypeChange}
                className="w-max bg-gray-100 text-gray-700 text-xs py-[3px] px-2 outline-none rounded-[2px]"
              >
                <option value="IMSI">IMSI</option>
                <option value="MSISDN">MSISDN</option>
                <option value="IMEI">IMEI</option>
              </select>
            </div>

            <div className="relative w-2/5">
              <IoIosSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={filterValue}
                onChange={handleFilterValueChange}
                placeholder={`Filter by ${filterType}`}
                className="w-full bg-gray-100 text-gray-700 py-[5px] pl-10 pr-3 outline-none rounded-[2px] text-xs"
              />
            </div>

            <button
              type="button"
              onClick={filterSubscribers}
              className="py-[6px] text-xs px-6 bg-mainBlue hover:bg-blue-500 text-white rounded"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="py-[6px] px-6 text-xs bg-gray-600 hover:bg-gray-700 text-gray-300 rounded"
            >
              Clear All
            </button>
          </form>
        </div>
        {isStillLoading && (
          <div className="my-[1vh] text-center w-full">
            <h2 className="text-mainBlue text-xs text-center maw-w-4/5">
              still fetching ...
            </h2>
          </div>
        )}
        <TableTemplate
          tableData={filteredData}
          isFetchingSubscribers={isFetchingSubscribers}
          onRowClick={handleRowClick}
        />
      </div>
      <div className="h-[300px] lg:h-full w-full lg:w-2/5 flex justify-center items-center">
        <GoogleMapsEmbed
          coordinates={
            selectedCoordinates.length
              ? selectedCoordinates
              : [KIGALI_COORDINATES]
          }
        />
      </div>
    </div>
  );
};

export default Home;
