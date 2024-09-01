// import React, { useState, useEffect } from 'react';
// import TableTemplate from '../tableTemplate/TableTemplate';
// import { IoIosSearch } from 'react-icons/io';
// import axios from 'axios';

// const formatDateToYMDHM = (dateString) => {
//   const date = new Date(dateString);
//   return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
//     date.getDate()
//   ).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(
//     2,
//     '0'
//   )}:${String(date.getMinutes()).padStart(2, '0')}`;
// };

// const Home = () => {
//   const [filterType, setFilterType] = useState('IMSI');
//   const [filterValue, setFilterValue] = useState('');
//   const [allSubscribers, setAllSubscribers] = useState([]);
//   const [formattedTableData, setFormattedTableData] = useState([]);
//   const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);

//   const handleFilterValueChange = (event) => setFilterValue(event.target.value);
//   const handleFilterTypeChange = (event) => setFilterType(event.target.value);

//   const GetAllSubscribers = async () => {
//     setIsFetchingSubscribers(true);
//     try {
//       const response = await axios.get(
//         'https://hdl-backend.onrender.com/subscribers'
//       );
//       setAllSubscribers(response?.data?.data?.users);
//       const formattedData = response?.data?.data?.users.map(
//         (subscriber, index) => ({
//           id: index + 1,
//           count: index + 1, // For the "#" column
//           startTime: formatDateToYMDHM(subscriber.startTime),
//           IMSI: subscriber.IMSI,
//           MSISDN: '**********' || subscriber.MSISDN,
//           IMEI: subscriber.IMEI,
//           MM: subscriber.MM,
//           R: subscriber.R,
//           Location: subscriber.Location,
//         })
//       );

//       setFormattedTableData(formattedData);
//     } catch (error) {
//       console.log('Failed to fetch subscribers', error);
//     } finally {
//       setIsFetchingSubscribers(false);
//     }
//   };

//   useEffect(() => {
//     GetAllSubscribers();
//   }, []);

//   const subscriberHeaders = [
//     { field: 'count', headerName: '#', minWidth: 50 },
//     { field: 'startTime', headerName: 'Time', minWidth: 150 },
//     { field: 'IMSI', headerName: 'IMSI', minWidth: 150 },
//     { field: 'MSISDN', headerName: 'MSISDN', minWidth: 150 },
//     { field: 'IMEI', headerName: 'IMEI', minWidth: 150 },
//     { field: 'MM', headerName: 'MM (Mobile Management State)', minWidth: 250 },
//     { field: 'R', headerName: 'R (Radio Access Type)', minWidth: 200 },
//     { field: 'Location', headerName: 'Location', minWidth: 200 },
//   ];

//   return (
//     <div className="h-max lg:h-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//       <div className="h-max lg:max-h-full lg:h-full w-full lg:w-3/5 flex flex-col gap-2 overflow-auto">
//         {/* operator and date filters form */}
//         <div className="flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-2 py-3">
//           <form
//             action="#"
//             className="flex flex-wrap gap-2 items-end justify-between w-full"
//           >
//             <div className="flex flex-col gap-[5px]">
//               <label htmlFor="operator" className="text-xs">
//                 Operator
//               </label>
//               <select
//                 name="operator"
//                 id="operator"
//                 className="w-max text-gray-500 text-sm py-[3px] px-2 outline-none rounded-[2px]"
//               >
//                 <option value="MTN">MTN</option>
//                 <option value="Airtel">Airtel</option>
//                 <option value="KTRN">KTRN</option>
//               </select>
//             </div>
//             <div className="flex flex-col gap-[5px]">
//               <label htmlFor="fromDate" className="text-xs">
//                 From
//               </label>
//               <input
//                 type="datetime-local"
//                 placeholder="Start Date"
//                 className="w-max text-gray-500 py-[3px] px-2 outline-none rounded-[2px] text-sm cursor-pointer"
//               />
//             </div>
//             <div className="flex flex-col gap-[5px]">
//               <label htmlFor="fromDate" className="text-xs">
//                 To
//               </label>
//               <input
//                 type="datetime-local"
//                 placeholder="End Date"
//                 className="w-max text-gray-500 py-[3px] px-2 outline-none rounded-[2px] text-sm cursor-pointer"
//               />
//             </div>
//             <button
//               type="submit"
//               className="py-[3px] px-6 bg-mainBlue hover:bg-blue-500 text-white rounded"
//             >
//               Filter
//             </button>
//           </form>
//         </div>
//         {/* table */}
//         <div className="flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-4 py-3">
//           {/* filters */}
//           <form
//             action="#"
//             className="flex gap-2 flex-wrap items-end justify-between w-full"
//           >
//             <div className="flex flex-col gap-[5px]">
//               <label htmlFor="subscriber" className="text-xs">
//                 Subscriber
//               </label>
//               <select
//                 name="subscriber"
//                 id="subscriber"
//                 value={filterType}
//                 onChange={handleFilterTypeChange}
//                 className="w-max text-gray-500 text-sm py-[3px] px-2 outline-none rounded-[2px]"
//               >
//                 <option value="IMSI">IMSI</option>
//                 <option value="MSISDN">MSISDN</option>
//                 <option value="IMEI">IMEI</option>
//               </select>
//             </div>

//             <div className="relative w-2/5">
//               <IoIosSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
//               <input
//                 type="text"
//                 value={filterValue}
//                 onChange={handleFilterValueChange}
//                 placeholder={`Filter by ${filterType}`}
//                 className="w-full text-gray-500 py-[4px] pl-10 pr-3 outline-none rounded-[2px] text-sm"
//               />
//             </div>

//             <button
//               type="submit"
//               className="py-[3px] px-6 bg-mainBlue hover:bg-blue-500 text-white rounded"
//             >
//               Search
//             </button>
//           </form>

//           {/* Table or Loader */}
//           <div className="mt-3 w-full">
//             {isFetchingSubscribers ? (
//               <div className="flex justify-center items-center h-[70vh] lg:h-[60vh]">
//                 {/* Simple Loader */}
//                 <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-t-4 rounded-full animate-spin"></div>
//               </div>
//             ) : (
//               <TableTemplate
//                 tableHeaders={subscriberHeaders}
//                 tableData={formattedTableData}
//                 styles="z-10 h-[70vh] lg:h-[60vh] overflow-auto border-[1px] border-gray-200 rounded"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="h-[70vh] lg:h-full w-full lg:w-2/5 rounded-md">
//         <iframe
//           title="map"
//           width="100%"
//           height="100%"
//           src="https://maps.google.com/maps?q=Kigali,%20Rwanda&t=&z=13&ie=UTF8&iwloc=&output=embed"
//           className="rounded-lg"
//         />
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import TableTemplate from '../tableTemplate/TableTemplate';
import { IoIosSearch } from 'react-icons/io';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import GoogleMapsEmbed from '../mapComponent/GoogleMapsEmbed';

const formatDateToYMDHM = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(
    2,
    '0'
  )}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const Home = () => {
  const [filterType, setFilterType] = useState('IMSI');
  const [filterValue, setFilterValue] = useState('');
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [formattedTableData, setFormattedTableData] = useState([]);
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleFilterValueChange = (event) => setFilterValue(event.target.value);
  const handleFilterTypeChange = (event) => setFilterType(event.target.value);

  const GetAllSubscribers = async () => {
    setIsFetchingSubscribers(true);
    try {
      const response = await axios.get(
        'https://hdl-backend.onrender.com/subscribers'
      );
      setAllSubscribers(response?.data?.data?.users);
      const formattedData = response?.data?.data?.users.map(
        (subscriber, index) => ({
          id: index + 1,
          count: index + 1,
          startTime: formatDateToYMDHM(subscriber.startTime),
          IMSI: subscriber.IMSI,
          MSISDN: '**********' || subscriber.MSISDN,
          IMEI: subscriber.IMEI,
          MM: subscriber.MM,
          R: subscriber.R,
          Location: subscriber.Location,
        })
      );

      setFormattedTableData(formattedData);
    } catch (error) {
      console.log('Failed to fetch subscribers', error);
    } finally {
      setIsFetchingSubscribers(false);
    }
  };

  useEffect(() => {
    GetAllSubscribers();
  }, []);

  const handleRowClick = (params) => {
    console.log('Row clicked:', params);
    if (params.field === 'MSISDN' || params.field === 'Location') {
      // For now, we'll use a static position (BK Arena)
      setSelectedLocation({ lat: -1.9441, lng: 30.0619 });
      console.log('Location set:', { lat: -1.9441, lng: 30.0619 });
    }
  };

  const subscriberHeaders = [
    { field: 'count', headerName: '#', minWidth: 50 },
    { field: 'startTime', headerName: 'Time', minWidth: 150 },
    { field: 'IMSI', headerName: 'IMSI', minWidth: 150 },
    {
      field: 'MSISDN',
      headerName: 'MSISDN',
      minWidth: 150,
      cellClassName: 'text-blue-500 cursor-pointer',
    },
    { field: 'IMEI', headerName: 'IMEI', minWidth: 150 },
    { field: 'MM', headerName: 'MM (Mobile Management State)', minWidth: 250 },
    { field: 'R', headerName: 'R (Radio Access Type)', minWidth: 200 },
    {
      field: 'Location',
      headerName: 'Location',
      minWidth: 200,
      cellClassName: 'text-mainBlue cursor-pointer',
    },
  ];

  return (
    <div className="h-max lg:h-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="h-max lg:max-h-full lg:h-full w-full lg:w-3/5 flex flex-col gap-2 overflow-auto">
        {/* operator and date filters form */}
        <div className="flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-2 py-3">
          <form
            action="#"
            className="flex flex-wrap gap-2 items-end justify-between w-full"
          >
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="operator" className="text-xs">
                Operator
              </label>
              <select
                name="operator"
                id="operator"
                className="w-max text-gray-500 text-sm py-[3px] px-2 outline-none rounded-[2px]"
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
                className="w-max text-gray-500 py-[3px] px-2 outline-none rounded-[2px] text-sm cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="fromDate" className="text-xs">
                To
              </label>
              <input
                type="datetime-local"
                placeholder="End Date"
                className="w-max text-gray-500 py-[3px] px-2 outline-none rounded-[2px] text-sm cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="py-[3px] px-6 bg-mainBlue hover:bg-blue-500 text-white rounded"
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
                className="w-max text-gray-500 text-sm py-[3px] px-2 outline-none rounded-[2px]"
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
                className="w-full text-gray-500 py-[4px] pl-10 pr-3 outline-none rounded-[2px] text-sm"
              />
            </div>

            <button
              type="submit"
              className="py-[3px] px-6 bg-mainBlue hover:bg-blue-500 text-white rounded"
            >
              Search
            </button>
          </form>

          {/* Table or Loader */}
         <div className="mt-3 w-full">
            {isFetchingSubscribers ? (
              <div className="flex justify-center items-center h-[70vh] lg:h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-t-4 rounded-full animate-spin"></div>
              </div>
            ) : (
              <TableTemplate
                tableHeaders={subscriberHeaders}
                showCheckBox={false}
                tableData={formattedTableData}
                styles="z-10 h-[70vh] lg:h-[60vh] overflow-auto border-[1px] border-gray-200 rounded"
                onRowClick={handleRowClick}
              />
            )}
          </div>
        </div>
      </div>
      <div className="h-[70vh] lg:h-full w-full lg:w-2/5 rounded-md">
        <GoogleMapsEmbed coordinates={selectedLocation || []} />
      </div>
    </div>
  );
};

export default Home;