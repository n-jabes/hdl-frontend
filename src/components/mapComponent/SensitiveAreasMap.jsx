import React, { useRef, useCallback } from 'react';
import {
  Circle,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import mapStyles from '../../utils/mapStyles';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

// Default coordinates for Kigali
const defaultCenter = {
  lat: -1.9577,
  lng: 30.1127,
};

const SensitiveAreasMap = ({ siteCoordinates }) => {
  const mapRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'f147f16e33a7b0e0',
    googleMapsApiKey: 'AIzaSyDJOXNvQcvI8m7BdR5bc4xmDvxE_wly5Sg',
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map; // Store the map instance in the ref
  }, []);

  // Use provided siteCoordinates if available, otherwise fallback to defaultCenter
  const center = siteCoordinates || defaultCenter;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      center={center}
      zoom={12}
      options={{ streetViewControl: false, styles: mapStyles }}
    >
      {/* Draw geofence circle around the marker */}
      <Circle center={center} radius={1500} options={greenOptions} />
      <Marker position={center} icon={blueIcon} />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

// Styles for geofence circle
const defaultOptions = {
  strokeWeight: 0.9,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

const greenOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.15,
  strokeColor: '#1279ff',
  fillColor: '#1279ff',
};

export default SensitiveAreasMap;
