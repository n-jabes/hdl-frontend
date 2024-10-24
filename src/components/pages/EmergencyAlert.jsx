import React, { useState } from 'react';
import TableComponent from '../tableComponent/TableComponent';
import { IoIosSearch } from 'react-icons/io';

const EmergencyAlert = () => {
  const [filterType, setFilterType] = useState('SiteName');
  const [filterValue, setFilterValue] = useState('');

  const handleFilterValueChange = (event) => setFilterValue(event.target.value);
  const handleFilterTypeChange = (event) => setFilterType(event.target.value);

  return (
    <div className="h-max lg:h-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* table */}
      <div className="h-full flex rounded-[5px] gap-2 flex-wrap bg-[#1A1D1F] px-4 py-3">
        {/* filters */}
        <form
          action="#"
          className="flex gap-2 flex-wrap items-end justify-between w-full md:w-4/5 lg:w-3/5"
        >
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="location" className="text-xs">
              Location
            </label>
            <select
              name="location"
              id="location"
              value={filterType}
              onChange={handleFilterTypeChange}
              className="w-max text-gray-500 text-sm py-[3px] px-2 outline-none rounded-[2px]"
            >
              <option value="SiteName">Site Name</option>
              <option value="SectorLocation">Sector Location</option>
            </select>
          </div>
          <div className="relative">
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
        {/* Table */}

        <div className="mt-3 w-full">
          <TableComponent styles="z-10  h-[70vh] lg:h-[65vh] rounded" />
        </div>
        <button
          type=""
          className="py-[3px] px-6 bg-mainBlue hover:bg-blue-500 text-white rounded"
        >
          Alert all !
        </button>
      </div>
    </div>
  );
};

export default EmergencyAlert;
