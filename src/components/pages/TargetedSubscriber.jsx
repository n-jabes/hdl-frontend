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

const TargetedSubscriber = () => {
  const [filterType, setFilterType] = useState('IMSI');
  const [filterValue, setFilterValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [targetedSubscriber, setTargetedSubscriber] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);
  const [isStillLoading, setIsStillLoading] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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

    try {
      // implement logic here
    } catch (error) {
      console.log('Failed to get location details: ', error);
    }
  };

  const GetAllSubscribers = async () => {
    setIsFetchingSubscribers(true);
    setIsStillLoading(true);
    try {
      const response = await axios.get(
        'https://hdl-backend.onrender.com/subscribers/subscriber-location'
      );
      setAllSubscribers(response?.data?.data?.subscribers);
    } catch (error) {
      console.log('Failed to fetch subscribers', error);
    } finally {
      setIsFetchingSubscribers(false);
      setIsStillLoading(false);
    }
  };

  useEffect(() => {
    GetAllSubscribers();
  }, []);

  const filterSubscribers = async () => {
    //avoid sending error messages when the system is still loading all subscribers
    if (isStillLoading) {
      alert(
        "We are still retriving all subscribers, please click 'Apply' again!"
      );
    } else {
      let filtered;

      if (filterValue) {
        setIsFetchingSubscribers(true);
        try {
          const response = await axios.get(
            `https://hdl-backend.onrender.com/subscribers/subscriber-filter/${filterType}/${filterValue}`
          );
  
          // console.log('response: ', response?.data?.data?.subscribers);
  
          filtered = response?.data?.data?.subscribers.map(
            (subscriber, index) => ({
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
              SiteName: subscriber?.matchingCoreArea?.SiteName,
              SectorLocation: subscriber?.matchingCoreArea?.SectorLocation,
            })
          );
  
          if (response?.data?.data.subscribers.length < 1) {
            // setError(`No results for subscriber with ${filterType} = ${filterValue}`)
            toast.info(
              `No results for subscriber with ${filterType} = ${filterValue}`,
              {
                position: 'top-right',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
              }
            );
          }
        } catch (error) {
          console.log('error: ', error);
          toast.error(error?.message, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
            transition: Bounce,
          });
        } finally {
          setIsFetchingSubscribers(false);
        }
        setTargetedSubscriber(filterValue);
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
      }));

      if (formattedData.length <= 0) {
        setErrorMessage(
          `Subscriber with ${filterType}: ${filterValue} not found`
        );
        setTargetedSubscriber('');
      } else {
        setFilteredData(formattedData);
        setErrorMessage(''); // Clear error message when data is found
      }
    }
  };

  const filterBasedOnTime = () => {
    let filtered = filteredData;

    if (filterValue) {
      filtered = allSubscribers.filter((subscriber) =>
        subscriber[filterType].includes(filterValue)
      );
      setTargetedSubscriber(filterValue);
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
    }));

    setFilteredData(formattedData);
  };

  const handleClearAll = () => {
    setFilterValue('');
    setFilterType('IMSI');
    setFromDate('');
    setToDate('');
    setFilteredData([]);
    setTargetedSubscriber('');
    setErrorMessage(''); // Clear error message when clearing filters
  };

  const extractCI = (location) => {
    if (!location || location === '?') {
      console.log('Invalid location');
      return null;
    }
    const parts = location.split('-');
    return parts[parts.length - 1];
  };

  const handleRowClick = (subscriber) => {
    const selectedMSISDN = subscriber.MSISDN;

    console.log('Clicked row: ', selectedMSISDN);
    const CIs = filteredData
      .filter((row) => row.MSISDN === selectedMSISDN)
      .map((row) => extractCI(row.Location))
      .filter((ci) => ci !== null);

    console.log('CIs:', CIs);

    const BK_ARENA_COORDINATES = { lat: -1.9441, lng: 30.0619 };
    const coordinates = [
      { lat: -1.9441, lng: 30.0619 },
      { lat: -1.9444, lng: 30.0618 },
      { lat: -1.9448, lng: 30.0621 },
      { lat: -1.945, lng: 30.0616 },
    ];

    setSelectedCoordinates(coordinates);
  };

  return (
    <div className="h-max lg:h-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="h-max lg:max-h-full lg:h-full w-full lg:w-3/5 flex flex-col gap-2 overflow-auto flex-shrink-0">
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
              <IoIosSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={filterValue}
                onChange={handleFilterValueChange}
                placeholder={`Filter by ${filterType}`}
                className={`w-full bg-gray-100 text-gray-700 py-[5px] pl-3 pr-10 outline-none rounded-[2px] text-xs ${
                  !targetedSubscriber && 'border-[2px] border-mainBlue'
                }`}
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

        {targetedSubscriber ? (
          <>
            {/* operator and date filters form */}
            <div className="flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-2 py-3">
              <form
                action="#"
                className="flex flex-wrap gap-2 items-end justify-between w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  filterBasedOnTime();
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
                    <option value="Orange">Orange</option>
                    <option value="AIRTEL">AIRTEL</option>
                    <option value="Africel">Africel</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="from" className="text-xs">
                    From
                  </label>
                  <input
                    type="datetime-local"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    name="from"
                    id="from"
                    className="w-full bg-gray-100 text-gray-700 text-xs py-[3px] px-2 outline-none rounded-[2px]"
                  />
                </div>

                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="to" className="text-xs">
                    To
                  </label>
                  <input
                    type="datetime-local"
                    placeholder="End Date"
                    value={toDate}
                    onChange={handleToDateChange}
                    name="to"
                    id="to"
                    className="w-full bg-gray-100 text-gray-700 text-xs py-[3px] px-2 outline-none rounded-[2px]"
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

            {/* display message */}
            <h3>
              {errorMessage ? (
                <span className="text-xs text-red-300 px-2">
                  {errorMessage}
                </span>
              ) : (
                <span className="text-xs text-green-300 px-2">
                  Showing results for {filterType}: {targetedSubscriber}
                </span>
              )}
            </h3>
            <TableTemplate
              tableData={filteredData}
              isFetchingSubscribers={isFetchingSubscribers}
              onRowClick={handleRowClick}
            />
          </>
        ) : (
          <h3 className="text-sm text-gray-300 px-4">
            {errorMessage ? (
              <span className="text-xs text-red-300">{errorMessage}</span>
            ) : (
              'Enter a subscriber above to filter results.'
            )}
          </h3>
        )}
      </div>
      <div className="h-[300px] lg:h-full lg:min-h-[85vh] w-full lg:w-2/5 flex justify-center items-center">
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

export default TargetedSubscriber;
