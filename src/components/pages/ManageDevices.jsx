import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TableTemplate from '../tableTemplate/TableTemplate';
import DevicesTable from '../deviceTable/DevicesTable';
import { Bounce, toast } from 'react-toastify';
import { DeviceButtons } from '../buttons/Buttons';

function ManageDevices(props) {
  const [allDevices, setAllDevices] = useState([]);
  //   const [allDevicesData, setAllDevicesData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFetchingDevices, setIsFetchingDevices] = useState(false);

  const fetchAllDevices = async () => {
    setIsFetchingDevices(true);

    try {
      const response = await axios.get(
        'https://hdl-backend.onrender.com/devices/all'
      );
      setAllDevices(response?.data?.data);
    //   console.log('Fetched all devices: ', response?.data?.data);
    } catch (error) {
      console.log('Failed to fetch all devices: ', error);
    } finally {
      setIsFetchingDevices(false);
    }
  };

  const deviceHeaders = [
    '#',
    'Title',
    'Identification Number',
    'Type',
    'Duration (days)',
    'Actions'
  ];
  
  const allDevicesData = allDevices.map((device, index) => ({
    index: ++index,
    deviceId: device.deviceId,
    title: device.title,
    type: device.deviceType,
    duration: device.duration,
    description: device.description,
    actions: <DeviceButtons deviceDetails={device} fetchAllDevices={fetchAllDevices} />
  }));

  const registerDevice = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    setIsRegistering(true);
    const formData = {
      title: e.target.title.value,
      deviceType: e.target.deviceType.value,
      deviceId: e.target.deviceId.value,
      duration: parseInt(e.target.duration.value, 10), // Convert to an integer
      description: e.target.description.value,
    };

    try {
      const response = await axios.post(
        'https://hdl-backend.onrender.com/devices/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Device registered successfully:', response.data);
      // You can also refresh the device list after registering
      fetchAllDevices();
      setShowPopup(false); // Close the popup after success
      toast.success('Device registered successfully!', {
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
    } catch (error) {
      console.log('Failed to register device: ', error);
      toast.error('Failed to register device', {
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
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    fetchAllDevices();
  }, []);

  return (
    <div>
      <h2 className="text-mainBlue text-sm w-full">Manage Devices</h2>
      {showPopup && (
        <div className="fixed top-0 left-0 bg-gray-800/90 z-[40] h-screen w-screen overflow-y-auto overflow-x-auto flex items-center justify-center">
          <div className="relative bg-gray-800 max-h-[70vh] border-[1px] border-gray-400 w-[90%] md:w-[50%]  lg:w-[38%] sm:w-[70%] lg:h-[32.5rem] sm:h-[36rem] md:h-[32rem] h-[38rem] px-[1.5%] py-[1.7%] rounded-md overflow-y-auto pb-4">
            <div className="w-[90%] mx-auto flex flex-col gap-[4rem] h-full">
              <button
                className="close border-2 border-red-400 rounded-md px-2 text-red-300 absolute right-4 top-4"
                onClick={() => setShowPopup(false)}
              >
                x
              </button>
              <h1 className="w-[70%] sm:h-[2rem] h-max capitalize text-gray-300 font-semibold mt-2 md:mt-0 text-sm md:text-md mb-4">
                Register New Device
              </h1>

              {/* form to register device */}
              <form
                action="#"
                className="flex flex-wrap gap-2 items-end justify-between w-full text-gray-300"
                onSubmit={registerDevice}
              >
                <div className="flex flex-wrap w-full items-center justify-between">
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="title" className="text-xs text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label
                      htmlFor="deviceType"
                      className="text-xs text-gray-300"
                    >
                      Device Type
                    </label>
                    <select
                      name="deviceType"
                      id="deviceType"
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    >
                      <option value="Cell phone" className="text-gray-600 ">
                        Mobile Phone
                      </option>
                      <option value="Vehicle" className="text-gray-600">
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
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="deviceId" className="text-xs text-gray-300">
                      Device Identification Number
                    </label>
                    <input
                      type="text"
                      name="deviceId"
                      id="deviceId"
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                    <label htmlFor="duration" className="text-xs text-gray-300">
                      Period (In days)
                    </label>
                    <input
                      type="text"
                      name="duration"
                      id="duration"
                      required
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>
                  <div className="flex flex-col gap-[2px] w-full min-w-[200px] mb-2">
                    <label
                      htmlFor="description"
                      className="text-xs text-gray-300"
                    >
                      Description
                    </label>
                    <textarea
                      type="text"
                      name="description"
                      id="description"
                      className="py-2 px-[2px] text-sm outline-none border-b-[1px] border-b-gray-200 bg-gray-300/5"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`py-2 px-6 text-xs  text-white rounded ${
                    isRegistering ? 'cursor-not-allowed bg-gray-600' : 'bg-mainBlue  hover:bg-blue-500'
                  }`}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex items-center justify-end mb-2">
        <button
          className="text-xs bg-gray-600 border-none text-gray-300 py-2 px-4 rounded-sm hover:bg-gray-700"
          onClick={() => setShowPopup(true)}
        >
          <span className="font-semibold mr-2">+</span> Register New Device
        </button>
      </div>
      {isFetchingDevices ? (
        <div className="w-full min-h-[50vh] h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <DevicesTable tableData={allDevicesData} headers={deviceHeaders} />
      )}
    </div>
  );
}

export default ManageDevices;
