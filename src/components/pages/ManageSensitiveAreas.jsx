import React, { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { DeviceButtons, SensitiveAreaButtons } from '../buttons/Buttons';
import ManageSensitiveAreasTable from '../manageSensitiveAreasTable/ManageSensitiveAreasTable';

const ManageSensitiveAreas = () => {
  const [allSensitiveAreas, setAllSensitiveAreas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFetchingSensitiveAreas, setIsFetchingSensitiveAreas] =
    useState(false);
  const [formErrors, setFormErrors] = useState({});

  const sensitiveAreasHeaders = [
    '#',
    'Date',
    'Sector Location',
    'Site Name',
    'Coordinates',
    'Actions',
  ];

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

    const azmuthNum = parseInt(formData.azmuth);
    if (
      !formData.azmuth ||
      isNaN(azmuthNum) ||
      azmuthNum < 0 ||
      azmuthNum > 360
    ) {
      errors.azmuth = 'Enter a valid azmuth (0 to 360)';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    return errors;
  };

  const fetchSensitiveAreas = () => {
    setIsFetchingSensitiveAreas(true);
    try {
      const storedAreas = localStorage.getItem('sensitiveAreas');
      if (storedAreas) {
        setAllSensitiveAreas(JSON.parse(storedAreas));
      }
    } catch (error) {
      toast.error('Failed to fetch sensitive areas', {
        position: 'top-right',
        autoClose: 2000,
      });
    } finally {
      setIsFetchingSensitiveAreas(false);
    }
  };

  const registerSensitiveArea = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    const formData = {
      sectorLocation: e.target.sectorLocation.value,
      siteName: e.target.siteName.value,
      longitude: e.target.longitude.value,
      latitude: e.target.latitude.value,
      azmuth: e.target.azmuth.value,
      description: e.target.description.value,
      date: new Date().toISOString(),
      id: `SA-${Date.now()}`,
    };

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsRegistering(false);
      return;
    }

    try {
      const existingAreas = JSON.parse(
        localStorage.getItem('sensitiveAreas') || '[]'
      );
      const updatedAreas = [...existingAreas, formData];
      localStorage.setItem('sensitiveAreas', JSON.stringify(updatedAreas));

      setAllSensitiveAreas(updatedAreas);
      setShowPopup(false);
      e.target.reset();

      toast.success('Sensitive Area registered successfully!', {
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
      toast.error('Failed to register sensitive area', {
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
      setFormErrors({});
    }
  };

  useEffect(() => {
    fetchSensitiveAreas();
  }, []);

  const allSensitiveAreasData = allSensitiveAreas.map((area, index) => ({
    index: index + 1,
    date: new Date(area.date).toLocaleDateString(),
    sectorLocation: area.sectorLocation,
    siteName: area.siteName,
    coordinates: `${area.latitude}, ${area.longitude}`,
    azmuth: area.azmuth,
    description: area.description,
    actions: (
      <SensitiveAreaButtons
        sensitiveAreaDetails={area}
        fetchAllSensitiveAreas={fetchSensitiveAreas}
      />
    ),
  }));

  const renderFormError = (field) => {
    return (
      formErrors[field] && (
        <span className="text-red-400 text-[10px] mt-1">
          {formErrors[field]}
        </span>
      )
    );
  };

  return (
    <div>
      <div className="w-full flex flex-col lg:flex-row gap-2">
        <div className="w-full min-h-[70vh] lg:w-3/5 mx-auto p-6 bg-mainBlack text-white rounded-lg shadow-md">
          {showPopup && (
            <div className="fixed top-0 left-0 bg-gray-800/90 z-[40] h-screen w-screen overflow-y-auto flex items-center justify-center">
              <div className="relative bg-gray-800 max-h-[70vh] border-[1px] border-gray-400 w-[90%] md:w-[50%] lg:w-[38%] sm:w-[70%] lg:h-[32.5rem] sm:h-[36rem] md:h-[32rem] h-[38rem] px-[1.5%] py-[1.7%] rounded-md overflow-y-auto pb-4">
                <div className="w-[90%] mx-auto flex flex-col gap-[4rem] h-full">
                  <button
                    className="close border-2 border-red-400 rounded-md px-2 text-red-300 absolute right-4 top-4"
                    onClick={() => {
                      setShowPopup(false);
                      setFormErrors({});
                    }}
                  >
                    x
                  </button>
                  <h1 className="w-[70%] sm:h-[2rem] h-max capitalize text-gray-300 font-semibold mt-2 md:mt-0 text-sm md:text-md mb-4">
                    Register New Sensitive Area
                  </h1>

                  <form
                    onSubmit={registerSensitiveArea}
                    className="flex flex-wrap gap-2 items-end justify-between w-full text-gray-300"
                  >
                    <div className="flex flex-wrap w-full items-center justify-between">
                      <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                        <label
                          htmlFor="sectorLocation"
                          className="text-xs text-gray-300"
                        >
                          Sector Location
                        </label>
                        <input
                          type="text"
                          name="sectorLocation"
                          id="sectorLocation"
                          className={`py-2 px-[2px] text-sm outline-none border-b-[1px] ${
                            formErrors.sectorLocation
                              ? 'border-b-red-400'
                              : 'border-b-gray-200'
                          } bg-gray-300/5`}
                        />
                        {renderFormError('sectorLocation')}
                      </div>

                      <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                        <label
                          htmlFor="siteName"
                          className="text-xs text-gray-300"
                        >
                          Site Name
                        </label>
                        <input
                          type="text"
                          name="siteName"
                          id="siteName"
                          className={`py-2 px-[2px] text-sm outline-none border-b-[1px] ${
                            formErrors.siteName
                              ? 'border-b-red-400'
                              : 'border-b-gray-200'
                          } bg-gray-300/5`}
                        />
                        {renderFormError('siteName')}
                      </div>

                      <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                        <label
                          htmlFor="latitude"
                          className="text-xs text-gray-300"
                        >
                          Latitude
                        </label>
                        <input
                          type="text"
                          name="latitude"
                          id="latitude"
                          className={`py-2 px-[2px] text-sm outline-none border-b-[1px] ${
                            formErrors.latitude
                              ? 'border-b-red-400'
                              : 'border-b-gray-200'
                          } bg-gray-300/5`}
                        />
                        {renderFormError('latitude')}
                      </div>

                      <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                        <label
                          htmlFor="longitude"
                          className="text-xs text-gray-300"
                        >
                          Longitude
                        </label>
                        <input
                          type="text"
                          name="longitude"
                          id="longitude"
                          className={`py-2 px-[2px] text-sm outline-none border-b-[1px] ${
                            formErrors.longitude
                              ? 'border-b-red-400'
                              : 'border-b-gray-200'
                          } bg-gray-300/5`}
                        />
                        {renderFormError('longitude')}
                      </div>

                      <div className="flex flex-col gap-[2px] w-[48%] min-w-[200px] mb-2">
                        <label
                          htmlFor="azmuth"
                          className="text-xs text-gray-300"
                        >
                          Azmuth
                        </label>
                        <input
                          type="text"
                          name="azmuth"
                          id="azmuth"
                          className={`py-2 px-[2px] text-sm outline-none border-b-[1px] ${
                            formErrors.azmuth
                              ? 'border-b-red-400'
                              : 'border-b-gray-200'
                          } bg-gray-300/5`}
                        />
                        {renderFormError('azmuth')}
                      </div>

                      <div className="flex flex-col gap-[2px] w-full min-w-[200px] mb-2">
                        <label
                          htmlFor="description"
                          className="text-xs text-gray-300"
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          className={`py-2 px-[2px] text-sm outline-none border-b-[1px] ${
                            formErrors.description
                              ? 'border-b-red-400'
                              : 'border-b-gray-200'
                          } bg-gray-300/5`}
                        />
                        {renderFormError('description')}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`py-2 px-6 text-xs text-white rounded mb-4 ${
                        isRegistering
                          ? 'cursor-not-allowed bg-gray-600'
                          : 'bg-mainBlue hover:bg-blue-500'
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
              <span className="font-semibold mr-2">+</span> Register New
              Sensitive Area
            </button>
          </div>

          {isFetchingSensitiveAreas ? (
            <div className="w-full min-h-[50vh] h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
            </div>
          ) : (
            <ManageSensitiveAreasTable
              tableData={allSensitiveAreasData}
              headers={sensitiveAreasHeaders}
            />
          )}
        </div>

        <div className="w-full lg:w-2/5 h-[50vh] lg:h-[85vh] flex flex-row lg:flex-col justify-between">
          <div className="bg-mainBlack h-[40vh] w-[49.5%] lg:w-full lg:h-[49%]">
            stats
          </div>
          <div className="bg-mainBlack h-[40vh] w-[49.5%] lg:w-full lg:h-[49%]">
            stats
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSensitiveAreas;
