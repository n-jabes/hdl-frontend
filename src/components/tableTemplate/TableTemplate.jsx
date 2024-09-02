



import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function TableTemplate({
  styles,
  tableHeaders,
  tableData,
  showCheckBox,
  onRowClick
}) {
  // Define column with a maskedMSISDN display for MSISDN field
  const columns = tableHeaders.map(header => {
    if (header.field === 'MSISDN') {
      return {
        ...header,
        renderCell: (params) => '*******', // Masked value
      };
    }
    return header;
  });

  return (
    <div className={`${styles}`}>
      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20]}
        checkboxSelection={showCheckBox}
        onRowClick={onRowClick}
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
            color: '#F0F0F0',
            backgroundColor: '#1A1D1F',
          },
          '& .MuiCheckbox-root': {
            color: '#F0F0F0',
          },
          '& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root': {
            color: '#1A1D1F !important',
          },
          '& .MuiTablePagination-root': {
            color: '#F0F0F0',
          },
          '& .MuiDataGrid-columnHeaders': {
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#1A1D1F',
          },
        }}
      />
    </div>
  );
}
