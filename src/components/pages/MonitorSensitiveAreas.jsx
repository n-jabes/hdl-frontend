import React, { useEffect, useState } from 'react';
import SensitiveAreasMap from '../mapComponent/SensitiveAreasMap';
import SensitiveAreasTable from '../sensitiveAreasTable/SensitiveAreasTable';
import axios from 'axios';
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

function MonitorSensitiveAreas(props) {
  const [tab, setTab] = useState('table');
  const [siteName, setSiteName] = useState('');
  const [sectorLocation, setSectorLocation] = useState('');
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [filteredData, setFilteredData] = useState(allSubscribers);
  const [filterType, setFilterType] = useState('IMSI');
  const [filterValue, setFilterValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);
  const [isStillLoading, setIsStillLoading] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [siteBasedSubscribers, setSiteBasedSubscribers] = useState([]);
  const [isFetchingSiteBasedSubscribers, setIsFetchingSiteBasedSubscribers] =
    useState(false);
  const [subscriberCoordinates, setSubscriberCoordinates] = useState([]);

  const KIGALI_COORDINATES = { lat: -1.9577, lng: 30.1127 };

  const handleFindSiteBasedSubscribers = async () => {
    setIsFetchingSiteBasedSubscribers(true);
    let subs;
    try {
      const response = await axios.get(
        `https://hdl-backend.onrender.com/subscribers/filter/by-sector-location/${sectorLocation}`
      );
      // console.log('Site based response: ', response);
      subs = response?.data?.data?.subscribers.map((sub, index) => ({
        index: ++index,
        IMSI: sub.IMSI,
        MSISDN: sub.MSISDN,
        IMEI: sub.IMEI,
        fullNames: sub.fullNames,
        startTime: formatDateToYMDHM(sub.startTime),
        SiteName: sub.SiteName,
        SectorLocation: sub.SectorLocation,
        Latitude: sub.Latitude,
        Longitude: sub.Longitude,
      }));
    } catch (error) {
      console.log('Failed to fetch site based subscribers');
      toast.error('Failed to fetch site based subscribers', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } finally {
      setIsFetchingSiteBasedSubscribers(false);
    }

    // console.log('Site based subs: ', subs);

    // Update user coordinates for map
    const coordinates = subs
      .map((subscriber) => ({
        fullNames: subscriber.fullNames,
        MSISDN: subscriber.MSISDN,
        lat: parseFloat(subscriber.Latitude || '-1.9577'),
        lng: parseFloat(subscriber.Longitude || '30.1127'),
      }))
      .filter((coord) => !isNaN(coord.lat) && !isNaN(coord.lng));

    // console.log("sub coordinates", subs)

    setSubscriberCoordinates(coordinates);
    setSiteBasedSubscribers(subs);
  };

  useEffect(() => {
    if(sectorLocation != ''){
      handleFindSiteBasedSubscribers();
    }
  }, [sectorLocation, filteredData]);

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

  const handleSetSiteName = (value) => {
    setSiteName(value);
  };

  const handleSetSectorLocation = (value) => {
    setSectorLocation(value);
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
      const [subscribersResponse] = await Promise.all([
        axios.get(
          'https://hdl-backend.onrender.com/subscribers/subscriber-location'
        ),
      ]);

      const subscribers = subscribersResponse?.data?.data?.subscribers;
      // console.log('All subscribers: ', subscribers);

      const formattedData = subscribers.map((subscriber, index) => ({
        id: index + 1,
        count: index + 1,
        startTime: formatDateToYMDHM(subscriber.startTime),
        IMSI: subscriber.IMSI,
        MSISDN: subscriber.MSISDN,
        maskedMSISDN: '*******',
        IMEI: subscriber.IMEI,
        MM: subscriber.MM,
        R: subscriber.R,
        fullNames: 'John Doe (Place holder)',
        Location: subscriber.Location,
        SiteName: subscriber?.matchingCoreArea?.SiteName,
        SectorLocation: subscriber?.matchingCoreArea?.SectorLocation,
        Latitude: subscriber?.matchingCoreArea?.Latitude,
        Longitude: subscriber?.matchingCoreArea?.Longitude,
      }));

      setAllSubscribers(formattedData);
      setFilteredData(formattedData);

      setIsFetchingSubscribers(false);
      setIsStillLoading(false);
    } catch (error) {
      console.log('Failed to fetch subscribers', error);
      toast.info('Failed to fetch subscribers', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
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

  const sensitiveAreasHeaders = [
    '#',
    'Time',
    'Full Names',
    'IMSI',
    'MSISDN',
    'IMEI',
  ];

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
              <label htmlFor="SiteName" className="text-sm text-gray-400">
                Enter Site Name
              </label>
              <input
                type="text"
                placeholder="Enter Site Name"
                name="SiteName"
                id="SiteName"
                onChange={(e) => handleSetSiteName(e.target.value)}
                className=" bg-gray-100 text-gray-600 text-xs py-3 px-3 outline-none rounded-[2px]"
              />
            </div>

            {siteName && (
              <div className="flex flex-col gap-[5px]">
                <label
                  htmlFor="SectorLocation"
                  className="text-sm text-gray-400"
                >
                  Choose Sector Location
                </label>
                <select
                  type="text"
                  placeholder="Choose Sector Location"
                  name="SectorLocation"
                  id="SectorLocation"
                  required
                  onChange={(e) => {
                    setSiteBasedSubscribers([]);
                    handleSetSectorLocation(e.target.value);
                  }}
                  className="bg-gray-100 text-gray-700 text-xs py-3 px-3 outline-none rounded-[2px]"
                >
                  <option value="">Select location</option>
                  <option value="4K311B">4K311B</option>
                  <option value="4K117A">4K117A</option>
                  <option value="4K194B">4K194B</option>
                </select>
              </div>
            )}
          </form>
          {isFetchingSiteBasedSubscribers ? (
            <p>Is Fetching site based subscribers</p>
          ) : (
            <div>
              {' '}
              {siteBasedSubscribers.length > 0 ? (
                <div className="h-max pt-2 lg:h-full flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between ">
                  <div className="h-max lg:max-h-full lg:h-full w-full lg:w-3/5 flex flex-col gap-2 overflow-auto flex-shrink-0">
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
                      siteCoordinates={KIGALI_COORDINATES}
                    />
                  </div>
                  <div className="h-[300px] lg:min-h-[90vh] w-full lg:w-2/5 flex justify-center items-center bg-red-200">
                    {isStillLoading ? (
                      <div className="my-[15vh] flex flex-col gap-2 items-center">
                        <h2 className="text-gray-600 text-xs w-2/3 text-center mt-4">
                          Performing a background fetch, please wait until the
                          fetch is done to see all data
                        </h2>
                      </div>
                    ) : (
                      <div className="w-full h-full">
                        <SensitiveAreasMap
                          subscriberCoordinates={subscriberCoordinates}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <h2 className="text-gray-400 mt-2">
                  Please select a site name
                </h2>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[90%]">
          <SensitiveAreasMap subscriberCoordinates={subscriberCoordinates} />
        </div>
      )}
    </div>
  );
}

export default MonitorSensitiveAreas;
