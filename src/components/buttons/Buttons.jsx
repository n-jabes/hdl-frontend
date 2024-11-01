import axios from 'axios';
import { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { toast, Bounce } from 'react-toastify';


export function UpdateButton({ deviceDetails, fetchAllDevices }) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isUpdatingDevice, setIsUpdatingDevice] = useState(false);
  const [formData, setFormData] = useState({
    title: deviceDetails.title,
    deviceType: deviceDetails.deviceType,
    deviceId: deviceDetails.deviceId,
    duration: deviceDetails.duration,
    description: deviceDetails.description,
  });



  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateDevice = async (e) => {
    e.preventDefault();

    // Check if any fields were modified before making the request
    if (
      formData.title === deviceDetails.title &&
      formData.deviceType === deviceDetails.deviceType &&
      formData.deviceId === deviceDetails.deviceId &&
      parseInt(formData.duration, 10) === deviceDetails.duration &&
      formData.description === deviceDetails.description
    ) {
      toast.warning('No changes were made.', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      return;
    }

    // console.log('Form data: ', formData)

    // Validate the duration is a number
    if (isNaN(parseInt(formData.duration, 10))) {
      toast.error('Duration must be a number.', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      return;
    }

    setIsUpdatingDevice(true);

    try {
      const response = await axios.put(
        `https://hdl-backend.onrender.com/devices/${deviceDetails._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setShowUpdateForm(false);
      toast.success('Device updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      fetchAllDevices();
    } catch (error) {
      console.error('Failed to update device:', error);
      toast.error(error?.response?.data?.message || 'Failed to update device', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    } finally {
      setIsUpdatingDevice(false);
    }
  };

  return (
    <div>
      {showUpdateForm && (
        <div className="fixed top-0 left-0 bg-gray-800/90 z-[40] h-screen w-screen overflow-y-auto overflow-x-auto flex items-center justify-center">
          <div className="relative bg-gray-800 max-h-[70vh] border-[1px] border-gray-400 w-[90%] md:w-[50%] lg:w-[38%] sm:w-[70%] lg:h-[32.5rem] sm:h-[36rem] md:h-[32rem] h-[38rem] px-[1.5%] py-[1.7%] rounded-md overflow-y-auto pb-4">
            <div className="w-[90%] mx-auto flex flex-col gap-[4rem] h-full">
              <button
                className="close border-2 border-red-400 text-[16px] py-[3px] rounded-md px-2 text-red-300 absolute right-4 top-4"
                onClick={() => setShowUpdateForm(false)}
              >
                x
              </button>
              <h1 className="w-[70%] sm:h-[2rem] h-max capitalize text-gray-300 font-semibold mt-2 md:mt-0 text-sm md:text-md mb-2">
                Update device: {deviceDetails.deviceId}
              </h1>

              {/* Form to update device */}
              <form
                onSubmit={updateDevice}
                className="flex flex-wrap gap-2 items-end justify-between w-full text-gray-300"
              >
                <div className="flex flex-wrap w-full items-center justify-between">
                  {/* Title */}
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-4">
                    <label htmlFor="title" className="text-xs text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    />
                  </div>

                  {/* Device Type */}
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-4">
                    <label
                      htmlFor="deviceType"
                      className="text-xs text-gray-300"
                    >
                      Device Type
                    </label>
                    <select
                      name="deviceType"
                      defaultValue={formData.deviceType}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    >
                      <option 
                        value="Cell phone" 
                        className="text-gray-600"
                      >
                        Mobile Phone
                      </option>
                      <option 
                        value="Vehicle" 
                        className="text-gray-600"
                      >
                        Vehicle
                      </option>
                      <option
                        value="Other Digital Device"
                        className="text-gray-600"
                      >
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Device ID */}
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-4">
                    <label htmlFor="deviceId" className="text-xs text-gray-300">
                      Device Identification Number
                    </label>
                    <input
                      type="text"
                      name="deviceId"
                      value={formData.deviceId}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-4">
                    <label htmlFor="duration" className="text-xs text-gray-300">
                      Period (In days)
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-[2px] w-full min-w-[200px] mb-2">
                    <label
                      htmlFor="description"
                      className="text-xs text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className={`py-2 px-6 text-xs text-white rounded ${
                    isUpdatingDevice
                      ? 'cursor-not-allowed bg-gray-600'
                      : 'bg-mainBlue hover:bg-blue-500'
                  }`}
                  disabled={isUpdatingDevice}
                >
                  {isUpdatingDevice ? 'Updating...' : 'Update'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <button
        className="btn btn-primary hover:bg-mainBlue hover:text-white rounded-[8px] py-1 px-[4px] text-mainBlue font-medium text-lg"
        onClick={() => setShowUpdateForm(true)}
      >
        <FaRegEdit />
      </button>
    </div>
  );
}

export function DeleteButton({ deviceDetails, fetchAllDevices }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDevice = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete device ${deviceDetails.deviceId}?`
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await axios.delete(
        `https://hdl-backend.onrender.com/devices/${deviceDetails._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Device deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      fetchAllDevices()
    } catch (error) {
      console.error('Failed to delete device: ', error);
      toast.error(error?.response?.data?.message || 'Failed to delete device', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className={`btn btn-danger hover:bg-red-600 text-red-600 hover:text-white rounded-[8px] py-1 px-[4px] font-medium text-lg ${
        isDeleting ? 'cursor-not-allowed bg-gray-600' : ''
      }`}
      onClick={deleteDevice}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
      ) : (
        <IoTrashOutline />
      )}
    </button>
  );
}

export function DeviceButtons({ deviceDetails, fetchAllDevices }) {
  return (
    <div className="flex gap-2 items-center">
      <UpdateButton deviceDetails={deviceDetails} fetchAllDevices={fetchAllDevices} />
      <DeleteButton deviceDetails={deviceDetails} fetchAllDevices={fetchAllDevices}/>
    </div>
  );
}


// sensitive area buttons

export function UpdateSensitiveAreaButton({ sensitiveAreaDetails, fetchAllSensitiveAreas }) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isUpdatingArea, setIsUpdatingArea] = useState(false);
  const [formData, setFormData] = useState({
    sectorLocation: sensitiveAreaDetails.sectorLocation,
    siteName: sensitiveAreaDetails.siteName,
    latitude: sensitiveAreaDetails.latitude,
    longitude: sensitiveAreaDetails.longitude,
    description: sensitiveAreaDetails.description
  });

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.sectorLocation.trim()) {
      errors.sectorLocation = 'Sector Location is required';
    }

    if (!formData.siteName.trim()) {
      errors.siteName = 'Site Name is required';
    }

    const longitudeNum = parseFloat(formData.longitude);
    if (
      !formData.longitude ||
      isNaN(longitudeNum) ||
      longitudeNum < -180 ||
      longitudeNum > 180
    ) {
      errors.longitude = 'Enter a valid longitude (-180 to 180)';
    }

    const latitudeNum = parseFloat(formData.latitude);
    if (
      !formData.latitude ||
      isNaN(latitudeNum) ||
      latitudeNum < -90 ||
      latitudeNum > 90
    ) {
      errors.latitude = 'Enter a valid latitude (-90 to 90)';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateSensitiveArea = async (e) => {
    e.preventDefault();
    setIsUpdatingArea(true);

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      toast.error('Please correct the form errors', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
      setIsUpdatingArea(false);
      return;
    }

    try {
      // Retrieve existing sensitive areas
      const existingAreas = JSON.parse(
        localStorage.getItem('sensitiveAreas') || '[]'
      );

      // Find and update the specific sensitive area
      const updatedAreas = existingAreas.map(area => 
        area.id === sensitiveAreaDetails.id 
          ? { ...area, ...formData } 
          : area
      );

      // Save updated areas back to localStorage
      localStorage.setItem('sensitiveAreas', JSON.stringify(updatedAreas));

      // Update state and close form
      fetchAllSensitiveAreas();
      setShowUpdateForm(false);

      toast.success('Sensitive Area updated successfully!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Failed to update sensitive area', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
    } finally {
      setIsUpdatingArea(false);
    }
  };

  return (
    <div>
      {showUpdateForm && (
        <div className="fixed top-0 left-0 bg-gray-800/90 z-[40] h-screen w-screen overflow-y-auto flex items-center justify-center">
          <div className="relative bg-gray-800 max-h-[70vh] border-[1px] border-gray-400 w-[90%] md:w-[50%] lg:w-[38%] sm:w-[70%] lg:h-[32.5rem] sm:h-[36rem] md:h-[32rem] h-[38rem] px-[1.5%] py-[1.7%] rounded-md overflow-y-auto pb-4">
            <div className="w-[90%] mx-auto flex flex-col gap-[4rem] h-full">
              <button
                className="close border-2 border-red-400 rounded-md px-2 text-red-300 absolute right-4 top-4"
                onClick={() => setShowUpdateForm(false)}
              >
                x
              </button>
              <h1 className="w-[70%] sm:h-[2rem] h-max capitalize text-gray-300 font-semibold mt-2 md:mt-0 text-sm md:text-md mb-4">
                Update Sensitive Area
              </h1>

              <form
                onSubmit={updateSensitiveArea}
                className="flex flex-wrap gap-2 items-end justify-between w-full text-gray-300"
              >
                <div className="flex flex-wrap w-full items-center justify-between">
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="sectorLocation" className="text-xs text-gray-300">
                      Sector Location
                    </label>
                    <input
                      type="text"
                      name="sectorLocation"
                      value={formData.sectorLocation}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>

                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="siteName" className="text-xs text-gray-300">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={formData.siteName}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>

                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="latitude" className="text-xs text-gray-300">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>

                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="longitude" className="text-xs text-gray-300">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>

                  <div className="flex flex-col gap-[2px] w-full min-w-[200px] mb-2">
                    <label htmlFor="description" className="text-xs text-gray-300">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`py-2 px-6 text-xs text-white rounded ${
                    isUpdatingArea
                      ? 'cursor-not-allowed bg-gray-600'
                      : 'bg-mainBlue hover:bg-blue-500'
                  }`}
                  disabled={isUpdatingArea}
                >
                  {isUpdatingArea ? 'Updating...' : 'Update'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <button
        className="btn btn-primary hover:bg-mainBlue hover:text-white rounded-[8px] py-1 px-[4px] text-mainBlue font-medium text-lg"
        onClick={() => setShowUpdateForm(true)}
      >
        <FaRegEdit />
      </button>
    </div>
  );
}

export function DeleteSensitiveAreaButton({ sensitiveAreaDetails, fetchAllSensitiveAreas }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSensitiveArea = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the sensitive area: ${sensitiveAreaDetails.siteName}?`
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // Retrieve existing sensitive areas
      const existingAreas = JSON.parse(
        localStorage.getItem('sensitiveAreas') || '[]'
      );

      // Filter out the area to be deleted
      const updatedAreas = existingAreas.filter(
        area => area.id !== sensitiveAreaDetails.id
      );

      // Save updated areas back to localStorage
      localStorage.setItem('sensitiveAreas', JSON.stringify(updatedAreas));

      // Refresh the list of sensitive areas
      fetchAllSensitiveAreas();

      toast.success('Sensitive Area deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
    } catch (error) {
      toast.error('Failed to delete sensitive area', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className={`btn btn-danger hover:bg-red-600 text-red-600 hover:text-white rounded-[8px] py-1 px-[4px] font-medium text-lg ${
        isDeleting ? 'cursor-not-allowed bg-gray-600' : ''
      }`}
      onClick={deleteSensitiveArea}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
      ) : (
        <IoTrashOutline />
      )}
    </button>
  );
}

export function SensitiveAreaButtons({ sensitiveAreaDetails, fetchAllSensitiveAreas }) {
  return (
    <div className="flex gap-2 items-center">
      <UpdateSensitiveAreaButton 
        sensitiveAreaDetails={sensitiveAreaDetails} 
        fetchAllSensitiveAreas={fetchAllSensitiveAreas} 
      />
      <DeleteSensitiveAreaButton 
        sensitiveAreaDetails={sensitiveAreaDetails} 
        fetchAllSensitiveAreas={fetchAllSensitiveAreas}
      />
    </div>
  );
}