import React, { useState } from 'react';

export default function DevicesTable({
  styles,
  tableData,
  onRowClick,
  headers,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState('');

  // Filter data based on input text
  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page change
  };

  return (
    <div className={`${styles}`}>
      {/* Filter */}
      <div className="mb-2 w-full">
        <input
          type="text"
          placeholder="Filter all columns..."
          className="p-2 outline-none rounded bg-gray-800 border border-gray-700 text-white text-xs w-1/2"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded border border-gray-700 h-[70vh] lg:h-[58vh]"
        style={{ maxHeight: '400px' }}
      >
        <table className="min-w-full text-xs text-gray-400 text-nowrap bg-gray-800 rounded-lg ">
          <thead className="sticky top-0 bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left font-light">{header}</th>
              ))}
            </tr>
          </thead>
            <tbody>
              {currentData.map((device, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-2">{device.index}</td>
                  <td className="px-4 py-2">{device.title}</td>
                  <td className="px-4 py-2">{device.deviceId}</td>
                  <td className="px-4 py-2">{device.type}</td>
                  <td className="px-4 py-2">{device.duration}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap gap-2 justify-between items-center mt-4 text-xs text-gray-300">
        <span>Total rows: {filteredData.length}</span>

        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-[2px] bg-gray-800 border border-gray-700 rounded outline-none"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={20}>25</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            &#8249;
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            &#8250;
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
