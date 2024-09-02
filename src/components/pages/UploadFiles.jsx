import React, { useState } from 'react';
import axios from 'axios';

function UploadFiles() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const UploadSubscribers = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://hdl-backend.onrender.com/subscribers/upload',
        formData ,
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
    </div>
  );
}

export default UploadFiles;
