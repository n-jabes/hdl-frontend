import React, { useEffect, useState } from 'react';
import SensitiveAreasMap from '../mapComponent/SensitiveAreasMap';
import SensitiveAreasTable from '../sensitiveAreasTable/SensitiveAreasTable';
import axios from 'axios';

const formatDateToYMDHM = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(
    '2',
    '0'
  )}:${String(date.getMinutes()).padStart(2, '0')}`;
};

function MonitorSensitiveAreas(props) {
  const [tab, setTab] = useState('table');
  const [sectorLocation, setSectorLocation] = useState('');
  const [siteName, setSiteName] = useState('');
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState('IMSI');
  const [filterValue, setFilterValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);
  const [isStillLoading, setIsStillLoading] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [siteBasedSubscribers, setSiteBasedSubscribers] = useState([]);

  const KIGALI_COORDINATES = { lat: -1.9577, lng: 30.1127 };

  const handleFindSiteBasedSubscribers = () => {
    const subs = filteredData
      .filter((item) => item.SiteName === siteName)
      .map((sub, index) => ({
        index: ++index,
        IMSI: sub.IMSI,
        MSISDN: sub.MSISDN,
        IMEI: sub.IMEI,
        startTime: formatDateToYMDHM(sub.startTime),
        SiteName: sub.SiteName,
        SectorLocation: sub.SectorLocation,
      }));
    console.log('Site Subs: ', subs);
    setSiteBasedSubscribers(subs);
  };

  useEffect(() => {
    handleFindSiteBasedSubscribers();
  }, [siteName, filteredData]);

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

  const handleSetSectorLocation = (value) => {
    setSectorLocation(value);
  };
  const handleSetSiteName = (value) => {
    setSiteName(value);
  };

  const filterSubscribers = () => {
    let filtered = siteBasedSubscribers;

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
    setFilteredData(siteBasedSubscribers);
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
        position: 'top-center',
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

  const sensitiveAreasHeaders = ['#', 'Time', 'IMSI', 'MSISDN', 'IMEI'];

  return (
    <div className="min-h-[85vh] h-full w-full pb-4">
      <h2 className="mb-[2px]">Monitor Sensitive Areas</h2>

      <div className="w-full flex flex-wrap gap-2 mb-2 border-b-[1px] border-b-gray-400">
        <button
          className={`text-sm text-gray-500 px-4 py-2 border-b-2 border-b-gray-400 hover:bg-gray-900 hover:text-gray-200 ${
            tab === 'table' && 'bg-gray-900 text-gray-200'
          }`}
          onClick={() => setTab('table')}
        >
          Table
        </button>
        <button
          className={`text-sm text-gray-500 px-4 py-2 border-b-2 border-b-gray-400 hover:bg-gray-900 hover:text-gray-200 ${
            tab === 'map' && 'bg-gray-900 text-gray-200'
          }`}
          onClick={() => setTab('map')}
        >
          Map
        </button>
      </div>

      {tab === 'table' ? (
        <div className="w-full">
          <form
            action="#"
            className="flex gap-2 items-end  flex-wrap w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleFindSiteBasedSubscribers();
            }}
          >
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="SectoLocation" className="text-sm text-gray-400">
                Enter Sector Location
              </label>
              <input
                type="text"
                placeholder="Enter Sector Location"
                name="SectorLocation"
                id="SectorLocation"
                onChange={(e) => handleSetSectorLocation(e.target.value)}
                className=" bg-gray-100 text-gray-600 text-xs py-3 px-3 outline-none rounded-[2px]"
              />
            </div>

            {/* only show sites when a sector location is present */}
            {sectorLocation && (
              <div className="flex flex-col gap-[5px]">
                <label htmlFor="SiteName" className="text-sm text-gray-400">
                  Choose Site
                </label>
                <select
                  type="text"
                  placeholder="Choose Site Name"
                  name="SiteName"
                  id="SiteName"
                  required
                  onChange={(e) => {
                    setSiteBasedSubscribers([]);
                    handleSetSiteName(e.target.value);
                  }}
                  className="bg-gray-100 text-gray-700 text-xs py-3 px-3 outline-none rounded-[2px]"
                >
                  <option value="">Select site</option>
                  <option value="Kamuhoza">Kamuhoza</option>
                  <option value="Golf_Club">Golf_Club</option>
                  <option value="MPW">MPW</option>
                </select>
              </div>
            )}
            {/* <button className="bg-mainBlue p-3 rounded-sm text-xs h-max">
              Search
            </button> */}
          </form>
          {siteBasedSubscribers.length > 0 ? (
            <div className="h-max lg:h-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ">
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
                      {/* <IoIosSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" /> */}
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
                <SensitiveAreasTable
                  tableData={siteBasedSubscribers}
                  isFetchingSubscribers={isFetchingSubscribers}
                  onRowClick={handleRowClick}
                  headers={sensitiveAreasHeaders}
                />
              </div>
              <div className="h-[300px] lg:h-full w-full lg:w-2/5 flex justify-center items-center">
                {isStillLoading && (
                  <div className="my-[15vh] flex flex-col gap-2 items-center">
                    {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainBlue"></div> */}
                    <h2 className="text-gray-600 text-xs w-2/3 text-center mt-4">
                      Performing a background fetch, please wait until the fetch
                      is done to see all data
                    </h2>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <h2 className="text-gray-400 mt-2">Please select a location</h2>
          )}
        </div>
      ) : (
        <div className="w-full h-[90%]">
          <SensitiveAreasMap />
        </div>
      )}
    </div>
  );
}

export default MonitorSensitiveAreas;
