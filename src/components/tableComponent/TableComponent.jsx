import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'firstName', headerName: 'First name', minWidth: 150 },
  { field: 'lastName', headerName: 'Last name', minWidth: 150 },
  { field: 'age', headerName: 'Age', type: 'number', minWidth: 100 },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function TableComponent({ styles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterText, setFilterText] = useState('');

  // Define the fields you want to filter on
  const filterFields = ['IMSI', 'IMEI', 'MSISDN'];

  const filteredData = rows.filter((item) => {
    // Trim and lowercase filter text to handle unnecessary spaces and case-insensitive search
    const searchText = filterText.trim().toLowerCase();

    // If there's no filter text, return all data
    if (!searchText) return true;

    // Loop through only the specified fields and see if any field contains the filter text
    return filterFields.some((field) => {
      // Check if the field exists in the item and if it's a valid string or number
      const fieldValue = item[field];
      if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
        return fieldValue.toString().toLowerCase().includes(searchText);
      }
      return false; // Skip non-string/number fields
    });
  });

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
              {columns.map((col) => (
                <th className="px-4 py-2 text-left font-semibold">
                  {col.headerName}
                </th>
              ))}
            </tr>
          </thead>
          {/* {isFetchingSubscribers ? (
            <tr>
              <td colSpan="5" className="text-center py-10">
                <div className="ml-[25vw] my-[15vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
                </div>
              </td>
            </tr> */}
          {/* ) : ( */}
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="px-4 py-2">{++index}</td>
                <td className="px-4 py-2">{row.lastName}</td>
                <td className="px-4 py-2">{row.firstName}</td>
                <td className="px-4 py-2">{row.age}</td>
              </tr>
            ))}
          </tbody>
          {/* )} */}
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap gap-2 justify-between items-center mt-4 text-xs text-gray-300">
        <span>Total rows: {rows.length}</span>

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
