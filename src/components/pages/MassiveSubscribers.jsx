import React, { useState } from 'react';
import TableComponent from '../tableComponent/TableComponent';
import { IoIosSearch } from 'react-icons/io';

const MassiveSubscribers = () => {
  const [filterType, setFilterType] = useState('IMSI');
  const [filterValue, setFilterValue] = useState('');

  const handleFilterValueChange = (event) => setFilterValue(event.target.value);
  const handleFilterTypeChange = (event) => setFilterType(event.target.value);

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
          {/* Table */}

          <div className="mt-3 w-full">
            <TableComponent styles="z-10  h-[70vh] lg:h-[60vh] overflow-auto border-[1px] border-gra-200 rounded" />
          </div>
        </div>
      </div>
      <div className=" h-[70vh] lg:h-full w-full lg:w-2/5 rounded-md">
        <iframe
          title="map"
          width="100%"
          height="100%"
          src="https://maps.google.com/maps?q=Kigali,%20Rwanda&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default MassiveSubscribers;
