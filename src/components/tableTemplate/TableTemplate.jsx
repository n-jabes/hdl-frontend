import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'firstName', headerName: 'First name', minWidth: 150 },
  { field: 'lastName', headerName: 'Last name', minWidth: 150 },
  { field: 'age', headerName: 'Age', type: 'number', minWidth: 100 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 175,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
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

export default function TableTemplate({ styles, tableHeaders, tableData, showCheckBox, showFilter  }) {
    // these styles should look like this: 'z-10  h-[70vh] lg:h-[60vh] overflow-auto border-[1px] border-gra-200 rounded'
  return (
    <div className={`${styles}`}>
      <DataGrid
        rows={tableData}
        columns={tableHeaders}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[10, 15, 20, 5]}
        // checkboxSelection
        checkboxSelection={showCheckBox} 
        sx={{
          flexWrap: 'nowrap',
          fontFamily: 'poppins',
          fontSize: '0.8rem',
          width: '100%',
          height: '100%',
          border: 'none',
          '& .MuiDataGrid-cell': {
            color: '#F0F0F0',
            border: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            color: '#F0F0F0', // Makes footer text white
            backgroundColor: '#1A1D1F', // Optional: match the footer background with headers
          },
          '& .MuiCheckbox-root': {
            color: '#F0F0F0', // Makes checkboxes white
          },
          '& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root': {
            color: '#1A1D1F !important', // Keeps the header checkbox black
          },
          '& .MuiTablePagination-root': {
            color: '#F0F0F0', // Ensures pagination text is white
          },
          '& .MuiDataGrid-columnHeaders': {
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#1A1D1F', // Optional: ensure the background is solid when scrolling
          },
        }}
      />
    </div>
  );
}
