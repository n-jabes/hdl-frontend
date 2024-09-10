import React, { useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import mapStyles from '../../utils/mapStyles';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -1.9577,
  lng: 30.1127, // Kigali's coordinates
};



const SensitiveAreasMap = () => {
  const mapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'f147f16e33a7b0e0',
    googleMapsApiKey: 'AIzaSyDJOXNvQcvI8m7BdR5bc4xmDvxE_wly5Sg',
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map; // Store the map instance in the ref
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      center={defaultCenter}
      zoom={12}
      options={{ streetViewControl: false, styles: mapStyles }}
    />
  ) : (
    <div>Loading...</div>
  );
};

export default SensitiveAreasMap;
