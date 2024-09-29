import React, { useState } from 'react';
import axios from 'axios';
import { parseExcelData } from '../../utils/readxlsx';

function UploadFiles() {
  const [file, setFile] = useState(null);
  const [coreAreasFile, setCoreAreasFile] = useState(null); // Add state to store the file

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file selection
  const handleCoreAreasChange = (e) => {
    const selectedFile = e.target.files[0]; // Get the first file from input
    setCoreAreasFile(selectedFile); // Set the selected file in state
  };

  const UploadSubscribers = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    console.log('Form data: ', formData);

    try {
      const response = await axios.post(
        'https://hdl-backend.onrender.com/subscribers/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // axios sets this automatically for FormData
          },
        }
      );

      console.log('response', response);

      if (response.status === 200) {
        console.log('File uploaded successfully:', response.data);
        alert('File uploaded successfully!');
      } else {
        console.error('File upload failed:', response.statusText);
        alert('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  // Function to handle the file upload
  const UploadCoreAreas = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!coreAreasFile) {
      alert('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();

    // This function is called once the file is read
    reader.onload = async (event) => {
      const fileBuffer = event.target.result;

      // Parse the file buffer
      const coreAreas = await parseExcelData(fileBuffer);
      console.log('Core Areas: ', coreAreas);

      // You can now send the coreAreas data to the backend or handle it further
    };

    // Read the file as ArrayBuffer
    reader.readAsArrayBuffer(coreAreasFile);
  };

  return (
    <div className="bg-[#1A1D1F] p-3">
      {/* upload subscribers */}
      <form onSubmit={UploadSubscribers} className="text-sm">
        <h2 className="mb-2">Upload subscribers</h2>
        <div className="my-2">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="w-max cursor-pointer"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-max px-4 py-2 bg-mainBlue hover:bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </form>
      {/* upload core areas */}
      <form onSubmit={UploadCoreAreas} className="text-sm mt-8">
        <h2 className="mb-2">Upload Core Areas</h2>
        <div className="my-2">
          <input
            type="file"
            accept=".xls, .xlsx"
            onChange={handleCoreAreasChange}
            className="w-max cursor-pointer"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-max px-4 py-2 bg-mainBlue hover:bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadFiles;
