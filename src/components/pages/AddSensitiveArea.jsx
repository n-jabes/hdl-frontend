import React, { useState } from 'react';

function AddSensitiveArea(props) {
  const [formData, setFormData] = useState({
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    location: '',
    siteName: '',
    sectorLocation: '',
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API
    console.log(formData);
  };
  return (
    <div>
      <div className=" w-full flex flex-col lg:flex-row  gap-2">
        {/* form container */}
        <div className="w-full lg:w-3/5 mx-auto p-6 bg-mainBlack text-white rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-center justify-between gap-2"
          >
            {[
              { label: 'Province', name: 'province' },
              { label: 'District', name: 'district' },
              { label: 'Sector', name: 'sector' },
              { label: 'Cell', name: 'cell' },
              { label: 'Village', name: 'village' },
              { label: 'Location', name: 'location' },
              { label: 'Site Name', name: 'siteName' },
              { label: 'Sector Location', name: 'sectorLocation' },
            ].map((field) => (
              <div key={field.name} className="mb-4 w-full md:w-[45%]">
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-100 text-mainBlack border border-gray-600 rounded-[2px]  outline-none "
                />
              </div>
            ))}

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-2">Reason</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 bg-gray-100 outline-none text-mainBlack border border-gray-600 rounded-[2px] "
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-mainBlue text-white font-bold rounded-md hover:bg-blue-600 transition"
            >
              + Add
            </button>
          </form>
        </div>

        {/* map container */}
        <div className="w-full lg:w-2/5 h-[50vh] lg:h-[85vh]">
          <iframe
            title="map"
            width="100%"
            height="100%"
            src="https://maps.google.com/maps?q=Kigali,%20Rwanda&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default AddSensitiveArea;
