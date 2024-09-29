import * as XLSX from 'xlsx';


/*
 HELPER FUNCTIONS
 */

function standardizeColumnName(column) {
  return column
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[*()]/g, '') // Remove asterisks, parentheses
    .replace(/[^a-zA-Z0-9_]/g, '') // Remove non-alphanumeric except underscores
    .replace(/[-]/g, '_') // Replace hyphens with underscores
    .toLowerCase(); // Convert to lowercase
}

function mapColumnName(column) {
  const mappings = {
    corelocation: 'CoreLocation',
    corelocation: 'CoreLocation',
    mcc: 'MCC',
    mnc: 'MNC',
    lac: 'LAC',
    rac: 'RAC',
    ci: 'CI',
    sitename: 'SiteName',
    sectorlocation: 'SectorLocation',
    longitude: 'Longitude',
    latitude: 'Latitude',
    azimuth: 'Azimuth',
    ran_id: 'RAN_Id',
    sector: 'Sector',
    location: 'Location',
  };
  const cleanedColumn = standardizeColumnName(column);
  return mappings[cleanedColumn] || cleanedColumn;
}

function standardizeColumns(data) {
  const standardColumns = [
    'CoreLocation',
    'MCC',
    'MNC',
    'LAC',
    'RAC',
    'CI',
    'SiteName',
    'SectorLocation',
    'Longitude',
    'Latitude',
    'Azimuth',
    'RAN_Id',
  ];

  return data.map((row) => {
    const standardRow = {};
    Object.entries(row).forEach(([col, value]) => {
      const mappedCol = mapColumnName(col);
      if (standardColumns.includes(mappedCol)) {
        standardRow[mappedCol] = value;
      }
    });

    standardColumns.forEach((col) => {
      if (!(col in standardRow)) {
        standardRow[col] = '?';
      }
    });

    return standardRow;
  });
}

/* END OF HELPER FUNCTIONS */

export async function parseExcelData(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const standardizedData = standardizeColumns(data);

  return standardizedData;
}
